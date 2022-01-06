import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';


export type OpenedStatus = { [key in RessourceName]?: boolean }
export type BaseTableRows = { [key in RessourceName]?: Row[] }

export interface ColumboState {
  isHeaderOpenFor: OpenedStatus;
  isCreateDialogOpenFor: OpenedStatus;
  baseTableRows: BaseTableRows;
}

function state(): ColumboState {
  return {
    isHeaderOpenFor: {},
    isCreateDialogOpenFor: {},
    baseTableRows: {},
  };
};

export default state;
