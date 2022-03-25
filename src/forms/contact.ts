import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import { phone } from 'src/forms/rules';

export const contactForm = {
    title: {
        component: BaseInputForm, icon: 'mdi-badge-account'
    },
    first_name: {
        component: BaseInputForm, icon: 'mdi-text-account', rules: [(val: string) => !!val || 'First name is required']
    },
    last_name: {
        component: BaseInputForm, icon: 'mdi-text-account', rules: [(val: string) => !!val || 'Last name is required']
    },
    phone: {
        component: BaseInputForm, icon: 'mdi-phone', rules: phone
    }
};
