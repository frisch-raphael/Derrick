import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';


export type HeaderOpenedStatus = { [key in RessourceName]?: boolean }
export type BaseTableRows = { [key in RessourceName]?: Row[] }

export interface ColumboState {
  isHeaderOpenFor: HeaderOpenedStatus;
  baseTableRows: BaseTableRows;
}

function state(): ColumboState {
  return {
    isHeaderOpenFor: {},
    baseTableRows: {},
  };
};

export default state;
