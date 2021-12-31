export const prettyVariable = (variable: string) => {
    const noComplexChar = variable.replace(/[^a-zA-Z0-9+]+/gi, ' ');
    return (noComplexChar.charAt(0).toUpperCase() + noComplexChar.slice(1));
};
