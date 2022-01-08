import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';
import { GenericRessource } from 'src/types/types';


export type OpenedStatus = { [key in RessourceName]?: boolean }
export type CreateEditDialogState = { isOpen: boolean, mode: 'edit' | 'create', ressourceToEdit: GenericRessource }
export type CreateEditDialogStatus = { [key in RessourceName]?: CreateEditDialogState }
export type BaseTableRows = { [key in RessourceName]?: Row[] }

export interface ColumboState {
  isHeaderOpenFor: OpenedStatus;
  createEditRessourceStatus: CreateEditDialogStatus;
  baseTableRows: BaseTableRows;
}

function state(): ColumboState {
  return {
    isHeaderOpenFor: {},
    createEditRessourceStatus: {},
    baseTableRows: {},
  };
};

export default state;
