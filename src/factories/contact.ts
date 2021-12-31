import faker from 'faker';
import { IContact } from 'src/dtos/contact';

export const makeFakeContact = (): IContact => {
    return {
        first_name: faker.name.findName(),
        last_name: faker.name.lastName(),
        title: faker.name.jobTitle(),
        phone: faker.phone.phoneNumber()
    };
};