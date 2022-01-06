import { ICompany } from 'src/dtos/company';
import { Scoring } from 'src/enums/enums';
import { EngagementState } from '../enums/enums';

export interface IEngagement {
    id: number,
    title: string,
    assessment_type: string,
    start_date: Date,
    end_date: Date,
    scoring: Scoring,
    language: string
    state: EngagementState
    company?: ICompany
}

export class Engagement implements IEngagement {

    public id = 0;
    public title = ''
    public assessment_type = ''
    public start_date = new Date()
    public end_date = new Date()
    public scoring = 0
    public language = ''
    public state = 0

    constructor(params: Record<string, any>) {
        Object.assign(this, params);
    }
}
