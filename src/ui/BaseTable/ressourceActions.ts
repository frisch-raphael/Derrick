import { IRestClient } from 'src/classes/api/restClient';
import { RessourceName } from 'src/enums/enums';
import { AxiosError } from 'axios';
import RestClient from 'src/classes/api/restClient';
import { GenericRessource } from 'src/types/types';
import { ParentRessource } from '../../types/types';
import { useUiStore } from '../../stores/ui';

export class RessourceActions {
    private restClient: IRestClient
    private store = useUiStore()

    constructor(
        private ressourceName: RessourceName,
        private parentRessource?: ParentRessource,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = new RestClient(ressourceName, parentRessource);
    }

    public async deleteRowsInTableAndBackend(ids: number[] | number) {
        try {
            if (typeof ids === 'number') ids = [ids];
            this.store.destroyRessourceTableRows(this.ressourceName, ids);
            await this.restClient.delete(ids);
        } catch (err) {
            const error = err as AxiosError;
            console.error('could not delete ressource: ' + error.message);
        }
    }

    public openEditDialog(ressource: GenericRessource) {
        this.store.updateCreateEditRessourceState(
            {
                isOpen: true,
                ressourceName: this.ressourceName,
                mode: 'edit',
                ressourceToEdit: ressource,
                parentRessource: this.parentRessource
            });
    }

    public openCreateDialog() {
        this.store.updateCreateEditRessourceState(
            {
                isOpen: true,
                ressourceName: this.ressourceName,
                mode: 'create',
                parentRessource: this.parentRessource
            });
    }
}
