import { IEngagement } from 'src/dtos/engagement';
import { Column } from 'src/types/types';
import { IContact } from 'src/dtos/contact';

type EngagementColumn = { name: keyof IEngagement } & Column<IEngagement>

export const engagementColumns: EngagementColumn[] = [
    {
        name: 'title', field: 'title', label: 'Title', required: true
    },
    {
        name: 'assessment_type', field: 'assessment_type', label: 'Assessment Type', required: true
    }, {
        name: 'start_date', field: 'start_date', label: 'Start date'
    }, {
        name: 'end_date', field: 'end_date', label: 'End date'
    }, {
        name: 'language', field: 'language', label: 'Language', required: true
    }];

type ContactColumn = { name: keyof IContact } & Column<IContact>

export const contactColumns: ContactColumn[] = [
    {
        name: 'first_name', field: 'first_name', label: 'First Name', required: true
    },
    {
        name: 'last_name', field: 'last_name', label: 'Last name', required: true
    }, {
        name: 'phone', field: 'phone', label: 'Phone'
    }, {
        name: 'title', field: 'title', label: 'Title'
    },
];