import BaseInputForm from 'src/ui/form/BaseInputForm.vue';

type FormComponent = typeof BaseInputForm


export type RessourceForm<T> = {
    [key in keyof Partial<T>]: { component: FormComponent, attrs?: Record<string, any> }
}

export type RessourceFormGeneric = Record<string, { component: FormComponent, attrs?: Record<string, any> }>