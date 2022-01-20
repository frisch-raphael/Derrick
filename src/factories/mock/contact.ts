import faker from 'faker';
import { IContact } from 'src/dtos/contact';
import { getRandomInt } from '../utils';

export const makeFakeContact = (): IContact => {
    return {
        id: getRandomInt(1000),
        first_name: faker.name.findName(),
        last_name: faker.name.lastName(),
        title: faker.name.jobTitle(),
        phone: faker.phone.phoneNumber()
    };
};

export const makeFakeContacts = (contactNumber: number): IContact[] => {
    const mockContacts: IContact[] = [];
    while (contactNumber--) mockContacts[contactNumber] = makeFakeContact();
    return mockContacts;
};