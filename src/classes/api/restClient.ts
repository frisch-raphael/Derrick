import request from 'src/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import { ApiRessource as string } from 'src/enums/enums';
import store from 'src/store';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { ressourceNameToApi } from 'src/utils';
import { ParentRessource } from '../../types/types';

export interface IRestClient {
    // index(): Promise<void>;
    delete(id: number[]): Promise<void>;
    update(id: number, payload: Record<string, any>): Promise<void>;
    create(payload: Record<string, any>): Promise<void>;
}

export default class RestClient implements IRestClient {

    private endpoint: string;

    constructor(private ressourceName: RessourceName, parentRessource?: ParentRessource) {
        if (parentRessource?.id && parentRessource?.ressource) {
            const parent = ressourceNameToApi[parentRessource.ressource];
            const ressource = ressourceNameToApi[ressourceName];
            this.endpoint = `${parent}/${parentRessource.id}${ressource}`;
        }
        else if (!parentRessource?.id && !parentRessource?.ressource) this.endpoint = ressourceNameToApi[ressourceName];
        else throw Error('Wrong parameters given to RestClient');


    }

    get ressourceUiName() {
        return this.ressourceName.replace('/', '').slice(0, -1);
    }

    private loading(ids: number[]) {
        store.commit(MutationType.setRessourceTableLoading, {
            ressource: this.ressourceName,
            ids: ids,
        });
    }

    private unload() {
        store.commit(MutationType.setRessourceTableLoading, { ressource: this.ressourceName, ids: [] });
    }

    public async delete(id: number[]) {
        this.loading(id);
        try {
            await request({ method: 'delete', url: `${this.endpoint}/${id.join(',')}` });
            Notify.create({
                message: `${this.ressourceUiName} deleted`,
                type: 'positive'
            });
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} deletion failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        } finally {

            this.unload();
        }
    }

    public async update<T>(id: number, post: Record<string, any>) {
        this.loading([id]);
        try {
            const ressource = await request<T>({ method: 'put', url: `${this.endpoint}/${id}`, data: post });
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' updated`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' update failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        } finally {

            this.unload();
        }
    }

    public async create<T>(post: Record<string, any>) {
        try {
            const ressource = await request<T>({ method: 'post', url: `${this.endpoint}`, data: { [this.ressourceName]: post } });
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' created`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' creation failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }
    }

    private getName(post: Record<string, string>) {
        return post.title ?? post.full_name ?? post.name ?? '';
    }


}