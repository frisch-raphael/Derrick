import faker from 'faker';
import { ICompany } from 'src/dtos/company';
// import { makeFakeContact } from './contact';

export const makeFakeCompany = (): ICompany => {
    const companyName = faker.company.companyName();
    return {
        website: faker.internet.url(),
        full_name: companyName,
        short_name: companyName.substring(0, 3),
        city: faker.address.city(),
        address: faker.address.streetAddress(),
        // contacts: [makeFakeContact(), makeFakeContact()]
    };
};