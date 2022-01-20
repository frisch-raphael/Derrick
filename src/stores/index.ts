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


export type OpenStateUpdate = { ressourceName: RessourceName, isOpen: boolean }
export type CreateEditRessourceStateUpdate = { ressourceName: RessourceName } & CreateEditDialogState
export type RessourceTableUpdate = { ressourceName: RessourceName, rows: Row[] }
export type RessourceTableCreateEdit = { ressourceName: RessourceName, row: Row }
export type RessourceTableDelete = { ressourceName: RessourceName, ids: number[] }
export type RessourceTableLoadingUpdate = { ressourceName: RessourceName, ids: number[] }

export const useStore = defineStore('main', {
    state: () => ({
        isHeaderOpenFor: {} as OpenedStatus,
        createEditRessourceStatus: {} as CreateEditDialogStatus,
        ressourceTableRows: {} as RessourceTableRows,
        ressourceTableLoading: {} as RessourceTableLoading,
    }),
    getters: {
        menuHeaderOpenedStatus: (state) => (ressource: RessourceName) => !!state.isHeaderOpenFor[ressource],
        createEditRessourceStatus: (state) => (ressource: RessourceName) => {
            const createEditStatus = state.createEditRessourceStatus[ressource];
            if (!createEditStatus) throw new Error('no createEditStatus for' + ressource);
            return createEditStatus;
        },
        RessourceTableRows: (state) => <T = Row[]>(ressource: RessourceName) =>
            state.ressourceTableRows[ressource] as T[] | undefined,
        isRessourceLoading: (state) => (ressource: RessourceName, id: number) =>
            !!state.ressourceTableLoading[ressource]?.includes(id),
    },
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
        updateRessourceMenu(update: OpenStateUpdate) {
            this.isHeaderOpenFor[update.ressourceName] = update.isOpen;
        },
        updateRessourceTable(update: RessourceTableUpdate) {
            this.ressourceTableRows[update.ressourceName] = update.rows;
        },
        destroyRessourceTableRows(destroy: RessourceTableDelete) {
            const currentRows = this.ressourceTableRows[destroy.ressourceName];
            this.ressourceTableRows[destroy.ressourceName] = currentRows?.filter(r => !destroy.ids.includes(r.id));
        },
        createEditOneRessourceTableRow(createEdit: RessourceTableCreateEdit) {
            const currentRows = this.ressourceTableRows[createEdit.ressourceName] ?? [];
            currentRows.map(r => r.id).includes(createEdit.row.id) ?
                this.ressourceTableRows[createEdit.ressourceName] = currentRows.map(r => r.id === createEdit.row.id ? createEdit.row : r)
                : this.ressourceTableRows[createEdit.ressourceName] = [...currentRows, createEdit.row];
        },
        setRessourceTableLoading(update: RessourceTableLoadingUpdate) {
            this.ressourceTableLoading[update.ressourceName] = update.ids;
        },
    },
});