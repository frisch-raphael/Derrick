import BaseInputForm from 'src/ui/form/BaseInputForm.vue';
import { RessourceFormType } from 'src/forms/types';
import { IContact } from '../dtos/contact';



export const contactForm: RessourceFormType<IContact> = {
    first_name: {
        component: BaseInputForm, icon: 'mdi-text-account', rules: [(val: string) => !!val || 'First name is required']
    },
    last_name: {
        component: BaseInputForm, icon: 'mdi-text-account', rules: [(val: string) => !!val || 'Last name is required']
    },
    phone: {
        component: BaseInputForm, icon: 'mdi-phone'
    },
    title: {
        component: BaseInputForm, icon: 'mdi-badge-account'
    }
};
