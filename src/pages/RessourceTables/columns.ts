import { IEngagement } from 'src/dtos/engagement';
import { Column } from 'src/types/types';
import { IContact } from 'src/dtos/contact';
import { ITemplateFinding } from '../../dtos/templateFinding';

type EngagementColumn = { name: keyof IEngagement } & Column<IEngagement>

export const engagementColumns: EngagementColumn[] = [
    {
        name: 'title', field: 'title', label: 'Title', required: true
    }, {
        name: 'assessment_type', field: 'assessment_type', label: 'Assessment type', required: true
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
        name: 'first_name', field: 'first_name', label: 'First name', required: true
    }, {
        name: 'last_name', field: 'last_name', label: 'Last name', required: true
    }, {
        name: 'phone', field: 'phone', label: 'Phone'
    }, {
        name: 'title', field: 'title', label: 'Title'
    },
];

type TemplateFindingColumn = { name: keyof ITemplateFinding } & Column<ITemplateFinding>

export const templateFindingColumns: TemplateFindingColumn[] = [
    {
        name: 'title', field: 'title', label: 'Title', required: true, align: 'left'
    },
    // {
    //     name: 'description', field: 'description', label: 'Description', required: true
    // }, 
    {
        name: 'assessment_type', field: 'assessment_type', label: 'Assessment type', align: 'left'
    }, {
        name: 'finding_type', field: 'finding_type', label: 'Finding type', align: 'left'
    },
    // {
    //     name: 'hacker_profile', field: 'hacker_profile', label: 'Hacker profile', align: 'left'
    // },
    // {
    //     name: 'remediation_effort', field: 'remediation_effort', label: 'Remediation effort'
    // }, {
    //     name: 'remediation_description', field: 'remediation_description', label: 'Remediation description', required: true
    // },
];