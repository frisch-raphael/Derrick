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
  [MutationType.createEditOneRessourceTableRow](state: S, add: RessourceTableCreateEdit): void,
  [MutationType.setRessourceTableLoading](state: S, add: RessourceTableLoading): void,
}

const mutation: MutationTree<ColumboState> & Mutations = {
  [MutationType.updateCreateEditRessourceState](state: ColumboState, update: CreateEditRessourceStateUpdate) {
    state.createEditRessourceStatus[update.ressource] = {
      isOpen: update.isOpen,
      mode: update.mode,
      ressourceToEdit: update.ressourceToEdit
    };
  },
  [MutationType.updateRessourceMenu](state: ColumboState, update: OpenStateUpdate) {
    state.isHeaderOpenFor[update.ressource] = update.isOpen;
  },
  [MutationType.updateRessourceTable](state: ColumboState, update: RessourceTableUpdate) {

    state.ressourceTableRows[update.ressource] = update.rows;
  },
  [MutationType.destroyRessourceTableRows](state: ColumboState, destroy: RessourceTableDelete) {
    const currentRows = state.ressourceTableRows[destroy.ressource];
    state.ressourceTableRows[destroy.ressource] = currentRows?.filter(r => !destroy.ids.includes(r.id));
  },
  [MutationType.createEditOneRessourceTableRow](state: ColumboState, createEdit: RessourceTableCreateEdit) {
    const currentRows = state.ressourceTableRows[createEdit.ressource] ?? [];
    currentRows.map(r => r.id).includes(createEdit.row.id) ?
      state.ressourceTableRows[createEdit.ressource] = currentRows.map(r => r.id === createEdit.row.id ? createEdit.row : r)
      : state.ressourceTableRows[createEdit.ressource] = [...currentRows, createEdit.row];

  },
  [MutationType.setRessourceTableLoading](state: ColumboState, update: RessourceTableLoading) {
    state.ressourceTableLoading[update.ressource] = update.ids;
  },
};

export default mutation;
