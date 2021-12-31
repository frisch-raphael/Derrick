import { RessourceName } from 'src/enums/enums';

export type HeaderOpenedStatus = { [key in RessourceName]?: boolean }

export interface ColumboState {
  isHeaderOpenFor: HeaderOpenedStatus | undefined;
}

function state(): ColumboState {
  return {
    isHeaderOpenFor: undefined
  };
};

export default state;
