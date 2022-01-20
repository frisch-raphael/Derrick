import { ICompany } from 'src/dtos/company';
import { Scoring } from 'src/enums/enums';
import { EngagementState } from '../enums/enums';
import { IContact } from './contact';

export interface IEngagement {
    id: number,
    title: string,
    assessment_type: string,
    start_date: string,
    end_date: string,
    scoring: Scoring,
    language: string,
    state: EngagementState,
    company?: ICompany,
    contacts?: IContact[]
}

export class Engagement implements IEngagement {

    public id = 0;
    public title = ''
    public assessment_type = ''
    public start_date = ''
    public end_date = ''
    public scoring = 0
    public language = ''
    public state = EngagementState.Ongoing

    constructor(params: Record<string, any>) {
        Object.assign(this, params);
    }
}
