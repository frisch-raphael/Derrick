import { CardAction } from 'src/types/types';
import { IRestClient } from 'src/classes/api/restClient';
import { HeaderAction } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { Store } from 'src/store/index';
import { DataTest } from 'src/enums/enums';
import { AxiosError } from 'axios';

export class Table {
    private restClient: IRestClient
    private ressourceName: RessourceName

    constructor(
        props: { restclient?: IRestClient, ressourceName: RessourceName } & Record<string, any>,
        private store: Store) {
        const { restClient } = props;
        if (!restClient) throw 'restClient is undefined';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = restClient;
        this.ressourceName = props.ressourceName;
    }

    private async deleteRowsInTableAndBackend(ids: number[] | number) {
        try {
            if (typeof ids === 'number') ids = [ids];
            this.store.commit(MutationType.destroyRessourceTableRows, { ressource: RessourceName.Engagement, ids: ids });
            await this.restClient.delete(ids);
        } catch (err) {
            const error = err as AxiosError;
            console.error('could not delete ressource:' + error.message);
        }

    }



    private async editRessource(id: number, payload: Record<string, any>) {
        await this.restClient.update(id, payload);
    }

    // private addRowToTable(id: number, payload: Record<string, any>) {
    //     this.emit('add')
    // }

    private getDefaultCardActions(): CardAction[] {
        return [
            {
                function: (id: number) => this.deleteRowsInTableAndBackend(id),
                isRessourcePayloadNeed: false,
                icon: 'mdi-delete',
                color: 'negative',
                tooltip: 'Remove',
                name: 'remove'
            },
            {
                function: (id: number, ressource: Record<string, any> & { id: number }) => this.store.commit(
                    MutationType.updateCreateEditRessourceState,
                    { isOpen: true, ressource: this.ressourceName, mode: 'edit', ressourceToEdit: ressource }),
                isRessourcePayloadNeed: true,
                icon: 'mdi-pencil',
                color: 'positive',
                tooltip: 'Edit',
                name: 'update'
            }
        ];
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
        return { defaultCardActions: this.getDefaultCardActions(), defaultHeaderActions: this.getDefaultHeaderActions() };
    }

}
