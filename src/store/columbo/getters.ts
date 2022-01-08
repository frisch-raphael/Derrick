import { GetterTree } from 'vuex';
import { State } from '../index';
import { ColumboState, CreateEditDialogState } from './state';
import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';

export type Getters = {
  menuHeaderOpenedStatus: (state: ColumboState) => (ressource: RessourceName) => boolean,
  createEditRessourceStatus: (state: ColumboState) => (ressource: RessourceName) => CreateEditDialogState,
  baseTableRows: (state: ColumboState) => (ressource: RessourceName) => Row[],
}

const getters: GetterTree<ColumboState, State> & Getters = {
  menuHeaderOpenedStatus: (state) => (ressource) => {
    return !!state.isHeaderOpenFor[ressource];
  },
  createEditRessourceStatus: (state) => (ressource) => {
    const createEditStatus = state.createEditRessourceStatus[ressource];
    if (!createEditStatus) {
      throw new Error('no createEditStatus for' + ressource);
    }
    return createEditStatus;
  },
  baseTableRows: (state) => (ressource): Row[] => {
    return state.baseTableRows[ressource] ?? [];
  },

};

export default getters;
