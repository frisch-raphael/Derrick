import { IRestClient } from 'src/classes/api/restClient';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { Store } from 'src/store/index';
import { AxiosError } from 'axios';
import RestClient from 'src/classes/api/restClient';
import { GenericRessource } from 'src/types/types';
import { ParentRessource } from '../../types/types';

export class RessourceActions {
    private restClient: IRestClient

    constructor(
        private ressourceName: RessourceName,
        private store: Store,
        private parentRessource?: ParentRessource,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = new RestClient(ressourceName, parentRessource);
    }

    public async deleteRowsInTableAndBackend(ids: number[] | number) {
        try {
            if (typeof ids === 'number') ids = [ids];
            this.store.commit(MutationType.destroyRessourceTableRows, {
                ressourceName: this.ressourceName,
                ids: ids
            });
            await this.restClient.delete(ids);
        } catch (err) {
            const error = err as AxiosError;
            console.error('could not delete ressource: ' + error.message);
        }
    }

    public openEditDialog(ressource: GenericRessource) {
        this.store.commit(
            MutationType.updateCreateEditRessourceState,
            {
                isOpen: true,
                ressourceName: this.ressourceName,
                mode: 'edit',
                ressourceToEdit: ressource,
                parentRessource: this.parentRessource
            });
    }

    public openCreateDialog() {
        this.store.commit(
            MutationType.updateCreateEditRessourceState,
            {
                isOpen: true,
                ressourceName: this.ressourceName,
                mode: 'create',
                parentRessource: this.parentRessource
            });
    }
}
