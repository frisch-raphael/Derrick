import { MutationTree } from 'vuex';
import { ColumboState } from './state';
import { MutationType } from 'src/store/columbo/mutations-types';
import { OpenStateUpdate } from 'src/store/columbo/types';
import { RessourceTableUpdate, RessourceTableAdd, RessourceTableDelete, CreateEditRessourceStateUpdate } from './types';

export type Mutations<S = ColumboState> = {
  [MutationType.updateRessourceMenu](state: S, update: OpenStateUpdate): void,
  [MutationType.updateCreateEditRessourceState](state: S, update: CreateEditRessourceStateUpdate): void,
  [MutationType.updateRessourceTable](state: S, update: RessourceTableUpdate): void,
  [MutationType.destroyRessourceTable](state: S, destroy: RessourceTableDelete): void,
  [MutationType.addOneRessourceTable](state: S, add: RessourceTableAdd): void,
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
    state.baseTableRows[update.ressource] = update.rows;
  },
  [MutationType.destroyRessourceTable](state: ColumboState, destroy: RessourceTableDelete) {
    const currentRows = state.baseTableRows[destroy.ressource];
    state.baseTableRows[destroy.ressource] = currentRows?.filter(r => !destroy.ids.includes(r.id));
  },
  [MutationType.addOneRessourceTable](state: ColumboState, add: RessourceTableAdd) {
    const currentRows = state.baseTableRows[add.ressource] ?? [];
    state.baseTableRows[add.ressource] = [...currentRows, add.row];
  }
};

export default mutation;
