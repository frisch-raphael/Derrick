import { Scoring } from 'src/enums/enums';

export interface IEngagement {
    title: string,
    start_date: Date,
    end_date: Date,
    scoring: Scoring,
    language: string,
    company: ICompany
}
