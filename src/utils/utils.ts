import { ApiRessource } from 'src/enums/enums';
import { DataTest, RessourceName } from 'src/enums/enums';
import { engagementForm } from 'src/forms/engagement';
import { RessourceFormGeneric } from 'src/forms/types';
import { companyForm } from '../forms/company';
import { contactForm } from '../forms/contact';
import { contactColumns, engagementColumns, templateFindingColumns } from '../pages/RessourceTables/columns';
import { Column, GenericRessource } from '../types/types';
import { templateFindingForm } from '../forms/templateFinding';

export const prettyVariable = (variable: string) => variable.replace(/[^a-zA-Z0-9+]+/gi, ' ');

export const capitalizeFirstLetter = (string: string) => {
    return (string.charAt(0).toUpperCase() + string.slice(1));
};

export const FullDataTest = (dataTest: DataTest) => {
    return `[data-test='${dataTest}']`;
};

export const FullDataCy = (dataTest: DataTest) => {
    return `[data-cy='${dataTest}']`;
};

// type GetForm = ((store: ReturnType<typeof useConfigStore>, language: string) => RessourceFormGeneric) | (() => RessourceFormGeneric)
export const ressourceConfig: { [key in RessourceName]: {
    form: RessourceFormGeneric,
    api: ApiRessource,
    columns: Column<GenericRessource>[]
} } =
{
    contact: { form: contactForm, api: ApiRessource.Contact, columns: contactColumns },
    company: { form: companyForm, api: ApiRessource.Contact, columns: contactColumns },
    engagement: { form: engagementForm, api: ApiRessource.Engagement, columns: engagementColumns },
    config: { form: companyForm, api: ApiRessource.Company, columns: engagementColumns },
    template_finding: { form: templateFindingForm, api: ApiRessource.TemplateFinding, columns: templateFindingColumns },
};

export const ressourceNameToApi: { [key in RessourceName]: ApiRessource } = {
    engagement: ApiRessource.Engagement,
    contact: ApiRessource.Contact,
    company: ApiRessource.Company,
    config: ApiRessource.Config,
    template_finding: ApiRessource.TemplateFinding
};
