import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import BaseDateForm from 'src/ui/form/BaseDateForm.vue';
import BaseSelectForm from 'src/ui/form/BaseSelectForm.vue';
import { RessourceFormType } from 'src/forms/types';
import { IEngagement } from '../dtos/engagement';
import { EngagementState } from '../enums/enums';



export const engagementForm: RessourceFormType<IEngagement> = {
    title: { component: BaseInputForm, icon: 'mdi-format-title' },
    assessment_type: {
        component: BaseSelectForm,
        attrs: { options: ['Internal', 'External'] },
        icon: 'mdi-cloud-outline'
    },
    language: {
        component: BaseSelectForm,
        attrs: { options: ['French', 'English'] },
        icon: 'mdi-translate'
    },
    state: {
        component: BaseSelectForm,
        attrs: { options: Object.keys(EngagementState).filter(k => k.length > 2) },
        icon: 'mdi-state-machine',
        default: EngagementState.Ongoing
    },
    start_date: { component: BaseDateForm },
    end_date: { component: BaseDateForm },
};
