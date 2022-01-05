import { RessourceName } from 'src/enums/enums';
import { Row } from 'src/types/types';

export type HeaderMenuStateUpdate = { ressource: RessourceName, isOpen: boolean }
export type RessourceTableUpdate = { ressource: RessourceName, rows: Row[] }
export type RessourceTableAdd = { ressource: RessourceName, row: Row }
export type RessourceTableDelete = { ressource: RessourceName, id: number } 