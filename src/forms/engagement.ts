import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import BaseDateForm from 'src/ui/form/BaseDateForm.vue';
import { RessourceForm } from 'src/forms/types';
import { IEngagement } from '../dtos/engagement';



export const engagementForm: RessourceForm<IEngagement> = {
    title: { component: BaseInputForm },
    assessment_type: { component: BaseInputForm },
    language: { component: BaseInputForm },
    start_date: { component: BaseDateForm },
    end_date: { component: BaseDateForm },
};

engagementForm.title?.component;