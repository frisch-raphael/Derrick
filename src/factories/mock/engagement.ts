import faker from 'faker';
import { IEngagement } from 'src/dtos/engagement';
import { makeFakeCompany } from 'src/factories/mock/company';
import { EngagementState } from 'src/enums/enums';
import { getRandomInt } from 'src/factories/utils';
import { DateTime } from 'luxon';
import { makeFakeContacts } from 'src/factories/mock/contact';

const languages = ['English'];
const tests = ['Internal pentest', 'Phishing campain', 'Applicat web Contoso'];
export const assess = ['Internal', 'External'];

export const makeFakeEngagement = (): IEngagement => {
    // const date = Math.random() * 365; 
    return {
        id: getRandomInt(10000),
        title: tests[getRandomInt(tests.length)],
        assessment_type: assess[getRandomInt(assess.length)],
        start_date: DateTime.fromJSDate(faker.date.past()).toFormat('yyyy/mm/dd'),
        end_date: DateTime.fromJSDate(faker.date.past()).toFormat('yyyy/mm/dd'),
        scoring: getRandomInt(1),
        state: EngagementState.Ongoing,
        language: languages[getRandomInt(languages.length)],
        company: makeFakeCompany(),
        contacts: makeFakeContacts(4)
    };
};

export const makeFakeEngagements = (engagementNumber: number): IEngagement[] => {
    // const date = Math.random() * 365; 
    const mockEngagements: IEngagement[] = [];
    while (engagementNumber--) mockEngagements[engagementNumber] = makeFakeEngagement();
    return mockEngagements;
};