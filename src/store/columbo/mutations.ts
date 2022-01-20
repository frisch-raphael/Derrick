import { MutationTree } from 'vuex';
import { ColumboState } from './state';
import { MutationType } from 'src/store/columbo/mutations-types';
import { OpenStateUpdate } from 'src/store/columbo/types';
import { RessourceTableUpdate, RessourceTableCreateEdit, RessourceTableDelete, CreateEditRessourceStateUpdate, RessourceTableLoading } from './types';

export type Mutations<S = ColumboState> = {
  [MutationType.updateRessourceMenu](state: S, update: OpenStateUpdate): void,
  [MutationType.updateCreateEditRessourceState](state: S, update: CreateEditRessourceStateUpdate): void,
  [MutationType.updateRessourceTable](state: S, update: RessourceTableUpdate): void,
  [MutationType.destroyRessourceTableRows](state: S, destroy: RessourceTableDelete): void,
  // [MutationType.destroyChildRessourceTableRows](state: S, destroy: RessourceTableChildDelete): void,
  [MutationType.createEditOneRessourceTableRow](state: S, add: RessourceTableCreateEdit): void,
  [MutationType.setRessourceTableLoading](state: S, add: RessourceTableLoading): void,
}

const mutation: MutationTree<ColumboState> & Mutations = {
  [MutationType.updateCreateEditRessourceState](state: ColumboState, update: CreateEditRessourceStateUpdate) {
    state.createEditRessourceStatus[update.ressourceName] = {
      isOpen: update.isOpen,
      mode: update.mode,
      ressourceToEdit: update.ressourceToEdit,
      isParentStoreTarget: update.isParentStoreTarget,
      parentRessource: update.parentRessource
    };
  },
  [MutationType.updateRessourceMenu](state: ColumboState, update: OpenStateUpdate) {
    state.isHeaderOpenFor[update.ressourceName] = update.isOpen;
  },
  [MutationType.updateRessourceTable](state: ColumboState, update: RessourceTableUpdate) {

    state.ressourceTableRows[update.ressourceName] = update.rows;
  },
  [MutationType.destroyRessourceTableRows](state: ColumboState, destroy: RessourceTableDelete) {
    const currentRows = state.ressourceTableRows[destroy.ressourceName];
    state.ressourceTableRows[destroy.ressourceName] = currentRows?.filter(r => !destroy.ids.includes(r.id));
  },
  // [MutationType.destroyChildRessourceTableRows](state: ColumboState, update: RessourceTableChildDelete) {
  //   const ressourceParam = update.parentRessource.param ?? update.ressourceName;
  //   const parentRow = state.ressourceTableRows[update.parentRessource.ressourceName]?.find(r => r.id === update.parentRessource.ressource?.id);
  //   if (!parentRow) throw Error('Trying to delete child from a ressource but parent not found in store');
  //   const filteredRessource = (parentRow[ressourceParam] as Array<GenericRessource>)
  //     .filter(r => !update.ids.includes(r.id));


  //   parentRow[ressourceParam] = filteredRessource;
  // },
  [MutationType.createEditOneRessourceTableRow](state: ColumboState, createEdit: RessourceTableCreateEdit) {
    const currentRows = state.ressourceTableRows[createEdit.ressourceName] ?? [];
    currentRows.map(r => r.id).includes(createEdit.row.id) ?
      state.ressourceTableRows[createEdit.ressourceName] = currentRows.map(r => r.id === createEdit.row.id ? createEdit.row : r)
      : state.ressourceTableRows[createEdit.ressourceName] = [...currentRows, createEdit.row];

  },
  [MutationType.setRessourceTableLoading](state: ColumboState, update: RessourceTableLoading) {
    state.ressourceTableLoading[update.ressourceName] = update.ids;
  },
};

export default mutation;
