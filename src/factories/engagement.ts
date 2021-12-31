import faker from 'faker';
import { IEngagement } from '../dtos/engagement';
import { getRandomInt } from './utils';
import { makeFakeCompany } from './company';

const languages = ['french', 'english'];
const tests = ['Internal pentest', 'Phishing campain', 'Applicat web Contoso'];

export const makeFakeEngagement = (): IEngagement => {
    // const date = Math.random() * 365; 
    return {
        id: getRandomInt(10000),
        title: tests[getRandomInt(tests.length)],
        assessment_type: tests[getRandomInt(tests.length)],
        start_date: faker.date.past(),
        end_date: faker.date.past(),
        scoring: getRandomInt(2),
        language: languages[getRandomInt(languages.length)],
        company: makeFakeCompany()
    };
};