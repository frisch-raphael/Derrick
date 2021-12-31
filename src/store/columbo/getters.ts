import { GetterTree } from 'vuex';
import { State } from '../index';
import { ColumboState } from './state';
import { RessourceName } from 'src/enums/enums';

export type Getters = {
  getMenuHeaderOpenedStatus(state: ColumboState, ressource: RessourceName): boolean
}

const getters: GetterTree<ColumboState, State> & Getters = {
  getMenuHeaderOpenedStatus(state, ressource: RessourceName) {
    if (!state.isHeaderOpenFor) return false;
    return !!state.isHeaderOpenFor[ressource];
  }
};

export default getters;
