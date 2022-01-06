import { ApiRessource } from 'src/enums/enums';
import { DataTest, RessourceName } from './enums/enums';
import { engagementForm } from './forms/engagement';
import { RessourceFormType } from 'src/forms/types';

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

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export const ressourceNameToApi: { [key in RessourceName]: ApiRessource } = {
    engagement: ApiRessource.Engagement,
    contact: ApiRessource.Contact,
    company: ApiRessource.Company
};

export const ressourceNameToForm: { [key in RessourceName]: RessourceFormType<any> } = {
    engagement: engagementForm,
    contact: engagementForm,
    company: engagementForm
};