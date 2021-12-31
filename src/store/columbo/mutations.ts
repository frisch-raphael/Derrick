import { MutationTree } from 'vuex';
import { ColumboState } from './state';
import { MutationType } from 'src/store/columbo/mutations-types';
import { HeaderMenuStateUpdate } from 'src/store/columbo/types';

export type Mutations<S = ColumboState> = {
  [MutationType.updateRessourceMenu](state: S, update: HeaderMenuStateUpdate): void
}

const mutation: MutationTree<ColumboState> & Mutations = {
  [MutationType.updateRessourceMenu](state: ColumboState, update: HeaderMenuStateUpdate) {
    if (!state.isHeaderOpenFor) state.isHeaderOpenFor = {};
    state.isHeaderOpenFor[update.ressource] = update.isOpen;
  }
};

export default mutation;
