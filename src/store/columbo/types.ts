import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';
import { CreateEditDialogState } from './state';

export type OpenStateUpdate = { ressource: RessourceName, isOpen: boolean }
export type CreateEditRessourceStateUpdate = { ressource: RessourceName } & CreateEditDialogState
export type RessourceTableUpdate = { ressource: RessourceName, rows: Row[] }
export type RessourceTableCreateEdit = { ressource: RessourceName, row: Row }
export type RessourceTableDelete = { ressource: RessourceName, ids: number[] }
export type RessourceTableLoading = { ressource: RessourceName, ids: number[] } 