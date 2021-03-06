import BaseInputForm from 'src/ui/form/BaseInputForm.vue';

type FormComponent = typeof BaseInputForm

export type RessourceFormParams = {
    component: FormComponent,
    attrs?: Record<string, any>,
    icon?: string,
    default?: string,
    rules?: any
}

export type RessourceFormType<T> = {
    [key in keyof Partial<T>]: RessourceFormParams
}

export type RessourceFormGeneric = Record<string, RessourceFormParams>