import { CardAction } from 'src/types/types';
import { IRestClient } from 'src/classes/api/engagement';
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
        private emit: (event: 'add', ...args: any[]) => void,
        private store: Store) {
        const { restClient } = props;
        if (!restClient) throw 'restClient is undefined';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = restClient;
        this.ressourceName = props.ressourceName;
        this.emit = emit;
    }

    private async deleteRowsInTableAndBackend(ids: number[] | number) {
        try {
            if (typeof ids === 'number') ids = [ids];
            this.store.commit(MutationType.destroyRessourceTable, { ressource: RessourceName.Engagement, ids: ids });
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
                color: 'red',
                tooltip: 'Remove',
                name: 'remove'
            },
            {
                function: (id: number, payload: Record<string, any>) => this.editRessource(id, payload),
                isRessourcePayloadNeed: true,
                icon: 'mdi-pencil',
                color: 'green',
                tooltip: 'Edit',
                name: 'update'
            }
        ];
    }

    private getDefaultHeaderActions(): HeaderAction[] {
        return [
            {
                function: () => this.store.commit(MutationType.updateCreateRessourceDialog, { isOpen: true, ressource: this.ressourceName }),
                params: 'none',
                icon: 'mdi-plus',
                datatest: 'add',
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
