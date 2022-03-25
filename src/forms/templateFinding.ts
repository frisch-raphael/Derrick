import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import BaseSelectFormMultiLanguage from 'src/ui/form/BaseSelectFormMultiLanguage.vue';
import { required } from './rules';


export const templateFindingForm =
{
    title: {
        component: BaseInputForm, icon: 'mdi-format-title', rules: required('Title is required')
    },
    assessment_type: {
        component: BaseSelectFormMultiLanguage,
        icon: 'mdi-cloud-outline',
        rules: required('Assessment type is required')
    },
    finding_type: {
        component: BaseSelectFormMultiLanguage,
        icon: 'mdi-format-list-bulleted-type',
    },
    hacker_profile: {
        component: BaseSelectFormMultiLanguage,
        icon: 'mdi-face-man-profile',
    },

};
