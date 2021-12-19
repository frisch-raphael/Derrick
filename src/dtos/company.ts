interface ICompany {
    short_name: string,
    full_name: string,
    website: string,
    city: string,
    address: string
    contacts?: IContact[]
}
