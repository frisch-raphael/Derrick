import { CardAction } from 'src/types/types';
import { IRestClient } from 'src/classes/api/engagement';
import { HeaderAction } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName } from 'src/enums/enums';
import { Store } from 'src/store/index';

export class Table {
    private restClient: IRestClient
    private ressourceName: string

    constructor(
        props: { restclient?: IRestClient, ressourceName: string } & Record<string, any>,
        private emit: (event: 'add', ...args: any[]) => void,
        private store: Store) {
        const { restClient } = props;
        if (!restClient) throw 'restClient is undefined';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = restClient;
        this.ressourceName = props.ressourceName;
        this.emit = emit;
    }

    private async deleteRowInTableAndBackend(id: number) {
        try {
            this.store.commit(MutationType.destroyOneRessourceTable, { ressource: RessourceName.Engagement, id: id });
            await this.restClient.delete(id);
        } catch (err) {
            console.error('could not delete ressource');
        }

    }

    private async postRowToBackend(id: number, payload: Record<string, any>) {
        await this.restClient.update(id, payload);
    }

    // private addRowToTable(id: number, payload: Record<string, any>) {
    //     this.emit('add')
    // }

    private getDefaultCardActions(): CardAction[] {
        return [
            {
                function: (id: number) => this.deleteRowInTableAndBackend(id),
                isRessourcePayloadNeed: false,
                icon: 'mdi-delete',
                color: 'red',
                tooltip: 'Remove',
                name: 'remove'
            },
            {
                function: (id: number, payload: Record<string, any>) => this.postRowToBackend(id, payload),
                isRessourcePayloadNeed: true,
                icon: 'mdi-content-save',
                color: 'green',
                tooltip: 'Save',
                name: 'save'
            }
        ];
    }

    private getDefaultHeaderActions(): HeaderAction[] {
        return [
            {
                function: () => this.emit('add'),
                isRowsNeeded: false,
                icon: 'mdi-plus',
                datatest: 'add',
                name: 'Create new ' + this.ressourceName
            }
        ];
    }

    public getDefaultActions() {
        return { defaultCardActions: this.getDefaultCardActions(), defaultHeaderActions: this.getDefaultHeaderActions() };
    }

}
