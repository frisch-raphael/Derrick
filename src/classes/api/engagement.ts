import request from 'src/axios';
import { Notify } from 'quasar';
import { AxiosError } from 'axios';
import { ApiRessource } from 'src/enums/enums';

export interface IRestClient {
    // index(): Promise<void>;
    delete(id: number[]): Promise<void>;
    update(id: number, payload: Record<string, any>): Promise<void>;
    create(payload: Record<string, any>): Promise<void>;
}

export default class RestClient implements IRestClient {

    constructor(private ressource: ApiRessource) {
    }

    get ressourceName() {
        return this.ressource.replace('/', '').slice(0, -1);
    }

    public async delete(id: number[]) {
        try {
            await request({ method: 'delete', url: `${this.ressource}/${id.join(',')}` });
            Notify.create({
                message: `${this.ressourceName} deleted`,
                type: 'positive'
            });
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceName} deletion failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }

    }

    public async update<T>(id: number, post: Record<string, any>) {
        try {
            const ressource = await request<T>({ method: 'put', url: `${this.ressource}/${id}`, data: post });
            Notify.create({
                message: `${this.ressourceName} '${this.getName(post)}' updated`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceName} update failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }

    }

    public async create<T>(post: Record<string, any>) {
        try {
            const ressource = await request<T>({ method: 'post', url: `${this.ressource}`, data: { engagement: post } });
            Notify.create({
                message: `${this.ressourceName} '${this.getName(post)}' created`,
                type: 'positive'
            });
            return ressource.data;
        } catch (error) {
            const err = error as AxiosError;
            Notify.create({
                message: `${this.ressourceName} creation failed : ${err.message}`,
                type: 'negative'
            });
            throw error;
        }
    }

    private getName(post: Record<string, string>) {
        return post.title ?? post.name ?? '';
    }


}