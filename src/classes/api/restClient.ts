import request from 'src/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import { RessourceName } from 'src/enums/enums';
import { ressourceNameToApi } from 'src/utils/utils';
import { ParentRessource } from '../../types/types';
import { capitalizeFirstLetter } from '../../utils/utils';
import { useUiStore } from 'src/stores/ui';

export interface IRestClient {
    // index(): Promise<void>;
    delete(id: number[]): Promise<void>;
    update(id: number, payload: Record<string, any>): Promise<void>;
    create(payload: Record<string, any>): Promise<void>;
}

export default class RestClient implements IRestClient {

    private endpoint: string;
    private store = useUiStore();

    constructor(private ressourceName: RessourceName, private parentRessource?: ParentRessource) {
        if (parentRessource?.ressource?.id && parentRessource?.ressourceName) {
            const parent = ressourceNameToApi[parentRessource.ressourceName];
            const ressource = ressourceNameToApi[ressourceName];
            this.endpoint = `${parent}/${parentRessource.ressource.id}${ressource}`;
        }
        else if (!parentRessource?.ressource?.id && !parentRessource?.ressourceName) {
            this.endpoint = ressourceNameToApi[ressourceName];
        }
        else throw Error('Wrong parameters given to RestClient');


    }

    get ressourceUiName() {
        return capitalizeFirstLetter(this.ressourceName);
    }

    private loading(ids: number[]) {
        // ressource is loading
        this.store.setRessourceTableLoading(this.ressourceName, ids);
        // parent is loading if it exists
        if (!this.parentRessource?.ressourceName || !this.parentRessource?.ressource?.id) return;
        this.store.setRessourceTableLoading(this.parentRessource?.ressourceName, [this.parentRessource?.ressource?.id]);
    }

    private unload() {
        this.store.setRessourceTableLoading(this.ressourceName, []);
        if (!this.parentRessource?.ressourceName || !this.parentRessource?.ressource?.id) return;
        this.store.setRessourceTableLoading(this.parentRessource?.ressourceName, []);
    }

    public async index<T>() {
        try {
            const ressources = await request<T[]>({ method: 'get', url: `${this.endpoint}` });
            return ressources.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceUiName} fetch failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }
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
        return post.title ?? post.full_name ?? post.first_name ?? post.name ?? '';
    }


}