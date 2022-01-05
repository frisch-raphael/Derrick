import { DataTest } from './enums/enums';
export const prettyVariable = (variable: string) => {
    const noComplexChar = variable.replace(/[^a-zA-Z0-9+]+/gi, ' ');
    return (noComplexChar.charAt(0).toUpperCase() + noComplexChar.slice(1));
};

export const FullDataTest = (dataTest: DataTest) => {
    return `[data-test='${dataTest}']`;
};