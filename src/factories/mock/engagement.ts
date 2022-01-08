import faker from 'faker';
import { IEngagement } from 'src/dtos/engagement';
import { makeFakeCompany } from 'src/factories/mock/company';
import { EngagementState } from 'src/enums/enums';
import { getRandomInt } from 'src/factories/utils';
import { DateTime } from 'luxon';

const languages = ['French', 'English'];
const tests = ['Internal pentest', 'Phishing campain', 'Applicat web Contoso'];
const assess = ['Internal', 'External'];

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
        company: makeFakeCompany()
    };
};

export const makeFakeEngagements = (engagementNumber: number): IEngagement[] => {
    // const date = Math.random() * 365; 
    const mockEngagements: IEngagement[] = [];
    while (engagementNumber--) mockEngagements[engagementNumber] = makeFakeEngagement();
    return mockEngagements;
};