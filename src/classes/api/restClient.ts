import request from 'src/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import { ApiRessource } from 'src/enums/enums';
import store from 'src/store';
import { useStore } from 'src/store';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { ressourceNameToApi } from 'src/utils';

export interface IRestClient {
    // index(): Promise<void>;
    delete(id: number[]): Promise<void>;
    update(id: number, payload: Record<string, any>): Promise<void>;
    create(payload: Record<string, any>): Promise<void>;
}

export default class RestClient implements IRestClient {

    private store;
    private ressource: ApiRessource;

    constructor(private ressourceName: RessourceName) {
        this.store = useStore();
        this.ressource = ressourceNameToApi[ressourceName];
    }

    get ressourceUiName() {
        return this.ressource.replace('/', '').slice(0, -1);
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
            await request({ method: 'delete', url: `${this.ressource}/${id.join(',')}` });
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
            const ressource = await request<T>({ method: 'put', url: `${this.ressource}/${id}`, data: post });
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' updated`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} update failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        } finally {

            this.unload();
        }
    }

    public async create<T>(post: Record<string, any>) {
        try {
            const ressource = await request<T>({ method: 'post', url: `${this.ressource}`, data: { engagement: post } });
            Notify.create({
                message: `${this.ressourceUiName} '${this.getName(post)}' created`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} creation failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }
    }

    private getName(post: Record<string, string>) {
        return post.title ?? post.name ?? '';
    }


}