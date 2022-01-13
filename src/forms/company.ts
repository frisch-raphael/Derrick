import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import BaseDateForm from 'src/ui/form/BaseDateForm.vue';
import BaseSelectForm from 'src/ui/form/BaseSelectForm.vue';
import { RessourceFormType } from 'src/forms/types';
import { EngagementState } from 'src/enums/enums';
import { ICompany } from '../dtos/company';



export const companyForm: RessourceFormType<ICompany> = {
    full_name: {
        component: BaseInputForm, icon: 'mdi-text-account', rules: [(val: string) => !!val || 'Name is required']
    },
    short_name: {
        component: BaseInputForm, icon: 'mdi-text-account'
    },
    city: {
        component: BaseInputForm, icon: 'mdi-home-city'
    },
    address: {
        component: BaseInputForm, icon: 'mdi-map-marker'
    },
    website: {
        component: BaseInputForm, icon: 'mdi-web'
    },

};
