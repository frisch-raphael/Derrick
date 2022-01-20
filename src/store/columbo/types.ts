import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';
import { CreateEditDialogState } from './state';
import { ParentRessource } from '../../types/types';

export type OpenStateUpdate = { ressourceName: RessourceName, isOpen: boolean }
export type CreateEditRessourceStateUpdate = { ressourceName: RessourceName } & CreateEditDialogState
export type RessourceTableUpdate = { ressourceName: RessourceName, rows: Row[] }
export type RessourceTableCreateEdit = { ressourceName: RessourceName, row: Row }
export type RessourceTableDelete = { ressourceName: RessourceName, ids: number[] }
export type RessourceTableChildDelete = { ressourceName: RessourceName, parentRessource: ParentRessource, ids: number[] }
export type RessourceTableLoading = { ressourceName: RessourceName, ids: number[] } 