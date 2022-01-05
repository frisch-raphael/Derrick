import BaseInputForm from 'src/ui/form/BaseInputForm.vue';

type FormComponent = typeof BaseInputForm

type RessourceFormParams = {
    component: FormComponent,
    attrs?: Record<string, any>,
    icon?: string,
}

export type RessourceFormType<T> = {
    [key in keyof Partial<T>]: RessourceFormParams
}

export type RessourceFormGeneric = Record<string, RessourceFormParams>