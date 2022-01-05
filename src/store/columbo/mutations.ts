import { MutationTree } from 'vuex';
import { ColumboState } from './state';
import { MutationType } from 'src/store/columbo/mutations-types';
import { HeaderMenuStateUpdate } from 'src/store/columbo/types';
import { RessourceTableUpdate, RessourceTableDelete as RessourceTableDestroy, RessourceTableAdd } from './types';

export type Mutations<S = ColumboState> = {
  [MutationType.updateRessourceMenu](state: S, update: HeaderMenuStateUpdate): void,
  [MutationType.updateRessourceTable](state: S, update: RessourceTableUpdate): void,
  [MutationType.destroyOneRessourceTable](state: S, destroy: RessourceTableDestroy): void,
  [MutationType.addOneRessourceTable](state: S, add: RessourceTableAdd): void,
}

const mutation: MutationTree<ColumboState> & Mutations = {
  [MutationType.updateRessourceMenu](state: ColumboState, update: HeaderMenuStateUpdate) {
    state.isHeaderOpenFor[update.ressource] = update.isOpen;
  },
  [MutationType.updateRessourceTable](state: ColumboState, update: RessourceTableUpdate) {
    state.baseTableRows[update.ressource] = update.rows;
  },
  [MutationType.destroyOneRessourceTable](state: ColumboState, destroy: RessourceTableDestroy) {
    const currentRows = state.baseTableRows[destroy.ressource];
    state.baseTableRows[destroy.ressource] = currentRows?.filter(r => destroy.id != r.id);
  },
  [MutationType.addOneRessourceTable](state: ColumboState, add: RessourceTableAdd) {
    const currentRows = state.baseTableRows[add.ressource] ?? [];
    state.baseTableRows[add.ressource] = [...currentRows, add.row];
  }
};

export default mutation;
