import { IEngagement } from 'src/dtos/engagement';
import { Column } from 'src/types/types';

type EngagementColumn = { name: keyof IEngagement } & Column<IEngagement>

export const engagementColumns: EngagementColumn[] = [
    {
        name: 'title', field: 'title', label: 'Title', required: true
    }, {
        name: 'assessment_type', field: 'assessment_type', label: 'Assessment Type', required: true
    }, {
        name: 'start_date', field: 'start_date', label: 'Start date'
    }, {
        name: 'end_date', field: 'end_date', label: 'End date'
    }, {
        name: 'language', field: 'language', label: 'Language', required: true
    }];