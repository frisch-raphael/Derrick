import { GetterTree } from 'vuex';
import { State } from '../index';
import { ColumboState } from './state';
import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';

export type Getters = {
  menuHeaderOpenedStatus(state: ColumboState, ressource: RessourceName): boolean,
  baseTableRows: (state: ColumboState) => (ressource: RessourceName) => Row[],
}

const getters: GetterTree<ColumboState, State> & Getters = {
  menuHeaderOpenedStatus(state, ressource) {
    return !!state.isHeaderOpenFor[ressource];
  },
  baseTableRows: (state) => (ressource): Row[] => {
    return state.baseTableRows[ressource] ?? [];
  },

};

export default getters;
