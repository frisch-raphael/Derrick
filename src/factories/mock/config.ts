import { IColumboConfig } from 'src/dtos/columboConfig';

export const makeFakeConfig = (): IColumboConfig => {
    return {
        assessment_types: [
            {
                fr: 'Interne',
                en: 'Internal'
            },
            {
                fr: 'Externe',
                en: 'External'
            },
            {
                fr: 'Web',
                en: 'Web'
            },
            {
                fr: 'Phishing',
                en: 'Phishing'
            }
        ],
        languages: [
            'en',
            'fr',
        ],
        finding_types: [
            {
                fr: 'Injection',
                en: 'Injection'
            },
            {
                fr: 'Autorisation',
                en: 'Authorization'
            },
            {
                fr: 'Gestion des mots de passe',
                en: 'Password management'
            }
        ]
        // contacts: [makeFakeContact(), makeFakeContact()]
    };
};
