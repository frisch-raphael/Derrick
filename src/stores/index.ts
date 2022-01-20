import { defineStore } from 'pinia';
import { RessourceName } from 'src/enums/enums';
import { GenericRessource, ParentRessource, Row } from 'src/types/types';

type OpenedStatus = { [key in RessourceName]?: boolean }
type CreateEditDialogState = {
    isOpen?: boolean,
    mode?: 'edit' | 'create',
    ressourceToEdit?: GenericRessource,
    isParentStoreTarget?: boolean,
    parentRessource?: ParentRessource
}
type CreateEditDialogStatus = { [key in RessourceName]?: CreateEditDialogState }
type RessourceTableRows = { [key in RessourceName]?: Row[] }
type RessourceTableLoading = { [key in RessourceName]?: number[] }


export type CreateEditRessourceStateUpdate = { ressourceName: RessourceName } & CreateEditDialogState

export const useStore = defineStore('main', {
    state: () => ({
        isHeaderOpenFor: {} as OpenedStatus,
        createEditRessourceStatus: {} as CreateEditDialogStatus,
        ressourceTableRows: {} as RessourceTableRows,
        ressourceTableLoading: {} as RessourceTableLoading,
    }),
    actions: {
        updateCreateEditRessourceState(update: CreateEditRessourceStateUpdate) {
            this.createEditRessourceStatus[update.ressourceName] = {
                isOpen: update.isOpen,
                mode: update.mode,
                ressourceToEdit: update.ressourceToEdit,
                isParentStoreTarget: update.isParentStoreTarget,
                parentRessource: update.parentRessource
            };
        },
        reinitCreateEditRessourceState(ressourceName: RessourceName) {
            this.createEditRessourceStatus[ressourceName] = {};
        },
        createEditRessourceFormOpenClose(ressourceName: RessourceName, isOpen: boolean) {
            if (!this.createEditRessourceStatus[ressourceName]) {
                throw Error('No createEdit for ' + ressourceName);
            }
            (this.createEditRessourceStatus[ressourceName] as CreateEditDialogState).isOpen = isOpen;
        },
        updateRessourceMenu(ressourceName: RessourceName, isOpen: boolean) {
            this.isHeaderOpenFor[ressourceName] = isOpen;
        },
        updateRessourceTable(ressourceName: RessourceName, rows: Row[]) {
            this.ressourceTableRows[ressourceName] = rows;
        },
        destroyRessourceTableRows(ressourceName: RessourceName, ids: number[]) {
            const currentRows = this.ressourceTableRows[ressourceName];
            this.ressourceTableRows[ressourceName] = currentRows?.filter(r => !ids.includes(r.id));
        },
        createEditOneRessourceTableRow(ressourceName: RessourceName, row: Row) {
            const currentRows = this.ressourceTableRows[ressourceName] ?? [];
            currentRows.map(r => r.id).includes(row.id) ?
                this.ressourceTableRows[ressourceName] = currentRows.map(r => r.id === row.id ? row : r)
                : this.ressourceTableRows[ressourceName] = [...currentRows, row];
        },
        setRessourceTableLoading(ressourceName: RessourceName, ids: number[]) {
            this.ressourceTableLoading[ressourceName] = ids;
        },
    },
});