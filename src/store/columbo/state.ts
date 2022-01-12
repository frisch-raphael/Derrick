import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';
import { GenericRessource } from 'src/types/types';


export type OpenedStatus = { [key in RessourceName]?: boolean }
export type CreateEditDialogState = { isOpen: boolean, mode: 'edit' | 'create', ressourceToEdit: GenericRessource }
export type CreateEditDialogStatus = { [key in RessourceName]?: CreateEditDialogState }
export type RessourceTableRows = { [key in RessourceName]?: Row[] }
export type RessourceTableLoading = { [key in RessourceName]?: number[] }

export interface ColumboState {
  isHeaderOpenFor: OpenedStatus;
  createEditRessourceStatus: CreateEditDialogStatus;
  ressourceTableRows: RessourceTableRows;
  ressourceTableLoading: RessourceTableLoading;
}

function state(): ColumboState {
  return {
    isHeaderOpenFor: {},
    createEditRessourceStatus: {},
    ressourceTableRows: {},
    ressourceTableLoading: {},
  };
};

export default state;
