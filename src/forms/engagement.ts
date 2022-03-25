import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import BaseDateForm from 'src/ui/form/BaseDateForm.vue';
import BaseSelectForm from 'src/ui/form/BaseSelectForm.vue';
import BaseSelectFormMultiLanguage from 'src/ui/form/BaseSelectFormMultiLanguage.vue';
import { EngagementState } from 'src/enums/enums';


export const engagementForm =
{
    title: {
        component: BaseInputForm, icon: 'mdi-format-title', rules: [(val: string) => !!val || 'Title is required']
    },
    assessment_type: {
        component: BaseSelectFormMultiLanguage,
        attrs: {},
        icon: 'mdi-cloud-outline',
        rules: [(val: string) => !!val || 'Assessment type is required']
    },
    language: {
        component: BaseSelectForm,
        attrs: {},
        icon: 'mdi-translate',
        rules: [(val: string) => !!val || 'Language is required']
    },
    state: {
        component: BaseSelectForm,
        // attrs: { options: useUiStore().ressourceTableRows.engagement?.map(e => e.id) },
        attrs: { options: Object.keys(EngagementState).filter(k => k.length > 2) },
        icon: 'mdi-state-machine',
        default: EngagementState.Ongoing
    },
    start_date: { component: BaseDateForm },
    end_date: { component: BaseDateForm },

};
