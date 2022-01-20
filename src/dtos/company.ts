import { IContact } from 'src/dtos/contact';

export interface ICompany {
    id: number,
    short_name: string,
    full_name: string,
    website: string,
    city: string,
    address: string
}

export interface IAssociatedCompany extends ICompany {
    contacts?: IContact[]
}
