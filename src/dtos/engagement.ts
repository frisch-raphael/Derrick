import { ICompany } from 'src/dtos/company';
import { Scoring } from 'src/enums/enums';

export interface IEngagement {
    id: number,
    title: string,
    assessment_type: string,
    start_date: Date,
    end_date: Date,
    scoring: Scoring,
    language: string
    company?: ICompany
}
