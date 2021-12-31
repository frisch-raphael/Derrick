import { CardAction } from 'src/types/types';
import { Notify } from 'quasar';
import { Row } from 'src/types/types';
import { IRestClient } from 'src/classes/api/engagement';
import { HeaderAction } from 'src/types/types';

export class Table {
    private restClient: IRestClient
    private state: { rows: Row[] }
    private ressourceName: string
    private emit: (event: 'add' | 'delete' | 'update', ...args: any[]) => void

    constructor(
        state: { rows: Row[] },
        props: { restclient?: IRestClient, ressourceName: string } & Record<string, any>,
        emit: (event: 'add' | 'delete' | 'update', ...args: any[]) => void) {
        const { restClient } = props;
        if (!restClient) throw 'restClient is undefined';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.restClient = restClient;
        this.state = state;
        this.ressourceName = props.ressourceName;
        this.emit = emit;
    }

    private async deleteRowInTableAndBackend(id: number) {
        try {
            await this.restClient.delete(id);
            this.state.rows = this.state.rows.filter(r => r.id != id);
            Notify.create({
                message: this.ressourceName + ' deleted', type: 'positive'
            });
            // emit('deleteRow')
        } catch (error) {
            console.error('could not delete ressource with id:' + id.toString());
            Notify.create({ message: 'Could not delete ' + this.ressourceName, type: 'negative' });
        }
    }

    private async postRowToBackend(id: number, payload: Record<string, any>) {
        try {
            await this.restClient.update(id, payload);
            // this.state.rows = this.state.rows.filter(r => r.id != id)
            Notify.create({
                message: this.ressourceName + ' deleted', type: 'positive'
            });
            // emit('deleteRow')
        } catch (error) {
            console.error('could not delete ressource with id:' + id.toString());
            Notify.create({ message: 'Could not delete ' + this.ressourceName, type: 'negative' });
        }
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
