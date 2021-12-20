import { Scoring } from 'src/enums/enums';

export interface IEngagement {
    id: number,
    title: string,
    start_date: Date,
    end_date: Date,
    scoring: Scoring,
    language: string,
    company: ICompany
}
