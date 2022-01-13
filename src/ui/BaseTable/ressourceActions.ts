import { CardAction } from 'src/types/types';
import { IRestClient } from 'src/classes/api/restClient';
import { HeaderAction } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { Store } from 'src/store/index';
import { DataTest } from 'src/enums/enums';
import { AxiosError } from 'axios';
import RestClient from '../../classes/api/restClient';
import { GenericRessource } from '../../types/types';

export class RessourceActions {
    private restClient: IRestClient

    constructor(
        private ressourceName: RessourceName,
        private store: Store) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = new RestClient(ressourceName);
    }

    public async deleteRowsInTableAndBackend(ids: number[] | number) {
        try {
            if (typeof ids === 'number') ids = [ids];
            this.store.commit(MutationType.destroyRessourceTableRows, { ressource: RessourceName.Engagement, ids: ids });
            await this.restClient.delete(ids);
        } catch (err) {
            const error = err as AxiosError;
            console.error('could not delete ressource:' + error.message);
        }

    }

    public openEditDialog(ressource: GenericRessource) {
        this.store.commit(
            MutationType.updateCreateEditRessourceState,
            { isOpen: true, ressource: this.ressourceName, mode: 'edit', ressourceToEdit: ressource });
    }

    private getDefaultHeaderActions(): HeaderAction[] {
        return [
            {
                function: () => this.store.commit(
                    MutationType.updateCreateEditRessourceState,
                    { isOpen: true, ressource: this.ressourceName, mode: 'create', ressourceToEdit: { id: 0 } }),
                params: 'none',
                icon: 'mdi-plus',
                datatest: DataTest.RessourceTableHeaderCreateNew,
                name: 'Create new ' + this.ressourceName
            },
            {
                function: (id: number[]) => this.deleteRowsInTableAndBackend(id),
                params: 'ids',
                icon: 'mdi-delete',
                datatest: DataTest.RessourceTableHeaderDeleteAll,
                name: 'Delete selected'
            }
        ];
    }

    public getDefaultActions() {
        return { defaultHeaderActions: this.getDefaultHeaderActions() };
    }

}
