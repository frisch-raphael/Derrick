import faker from 'faker';

export const makeFakeContact = (): IContact => {
    return {
        first_name: faker.name.findName(),
        last_name: faker.name.lastName(),
        title: faker.name.jobTitle(),
        phone: faker.phone.phoneNumber()
    }
}