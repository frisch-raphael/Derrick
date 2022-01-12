import { GetterTree } from 'vuex';
import { State } from '../index';
import { ColumboState, CreateEditDialogState } from './state';
import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';

export type Getters = {
  menuHeaderOpenedStatus: (state: ColumboState) => (ressource: RessourceName) => boolean,
  createEditRessourceStatus: (state: ColumboState) => (ressource: RessourceName) => CreateEditDialogState,
  RessourceTableRows: (state: ColumboState) => (ressource: RessourceName) => Row[],
  isRessourceLoading: (state: ColumboState) => (ressource: RessourceName, id: number) => boolean,
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
  RessourceTableRows: (state) => (ressource): Row[] => {
    return state.ressourceTableRows[ressource] ?? [];
  },
  isRessourceLoading: (state) => (ressource, id: number): boolean => {
    return !!state.ressourceTableLoading[ressource]?.includes(id);
  },

};

export default getters;
