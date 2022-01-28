import { ApiRessource } from 'src/enums/enums';
import { DataTest, RessourceName } from 'src/enums/enums';
import { engagementForm } from 'src/forms/engagement';
import { RessourceFormGeneric } from 'src/forms/types';
import { companyForm } from '../forms/company';
import { contactForm } from '../forms/contact';
import { contactColumns, engagementColumns } from '../pages/columns';
import { Column, GenericRessource } from '../types/types';
import { useConfigStore } from '../stores/config';

export const prettyVariable = (variable: string) => {
    const noComplexChar = variable.replace(/[^a-zA-Z0-9+]+/gi, ' ');
    return (noComplexChar.charAt(0).toUpperCase() + noComplexChar.slice(1));
};

export const capitalizeFirstLetter = (string: string) => {
    return (string.charAt(0).toUpperCase() + string.slice(1));
};

export const FullDataTest = (dataTest: DataTest) => {
    return `[data-test='${dataTest}']`;
};

type GetForm = ((store: ReturnType<typeof useConfigStore>, language: string) => RessourceFormGeneric) | (() => RessourceFormGeneric)
export const ressourceConfig: { [key in RessourceName]: {
    getForm: GetForm,
    api: ApiRessource,
    columns: Column<GenericRessource>[]
} } =
{
    contact: { getForm: contactForm, api: ApiRessource.Contact, columns: contactColumns },
    company: { getForm: companyForm, api: ApiRessource.Contact, columns: contactColumns },
    engagement: { getForm: engagementForm, api: ApiRessource.Engagement, columns: engagementColumns },
    config: { getForm: companyForm, api: ApiRessource.Company, columns: engagementColumns }
};

export const ressourceNameToApi: { [key in RessourceName]: ApiRessource } = {
    engagement: ApiRessource.Engagement,
    contact: ApiRessource.Contact,
    company: ApiRessource.Company,
    config: ApiRessource.Config
};
