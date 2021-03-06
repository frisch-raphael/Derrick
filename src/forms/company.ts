import BaseInputForm from 'src/ui/form/BaseInputForm.vue';

export const companyForm = {
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
