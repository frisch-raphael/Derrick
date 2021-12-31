import request from 'src/axios';
import { ApiRessource } from 'src/enums/enums';




export interface IRestClient {
    // index(): Promise<void>;
    delete(id: number): Promise<void>;
    update(id: number, payload: Record<string, any>): Promise<void>;
    create(payload: Record<string, any>): Promise<void>;
}

export default class RestClient implements IRestClient {
    public ressource: ApiRessource

    constructor(ressource: ApiRessource) {
        this.ressource = ressource;
    }

    // public index() {
    //     console.log('')
    // }

    public async delete(id: number) {
        await request({ method: 'delete', url: `${this.ressource}/${id}` });
    }

    public async update(id: number, post: Record<string, any>) {
        await request({ method: 'put', url: `${this.ressource}/${id}`, data: post });
    }

    public async create(post: Record<string, any>) {
        await request({ method: 'post', url: `${this.ressource}`, data: post });
    }
}