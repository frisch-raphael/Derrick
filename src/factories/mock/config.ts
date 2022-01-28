import { IColumboConfig } from 'src/dtos/columbo-config';

export const makeFakeConfig = (): IColumboConfig => {
    return {
        assessment_types: [
            {
                fr: 'Interne',
                gb: 'Internal'
            },
            {
                fr: 'Externe',
                gb: 'External'
            },
            {
                fr: 'Web',
                gb: 'Web'
            },
            {
                fr: 'Phishing',
                gb: 'Phishing'
            }
        ],
        languages: [
            'gb',
            'fr',
        ],
        finding_types: [
            {
                fr: 'Injection',
                gb: 'Injection'
            },
            {
                fr: 'Autorisation',
                gb: 'Authorization'
            },
            {
                fr: 'Gestion des mots de passe',
                gb: 'Password management'
            }
        ]
        // contacts: [makeFakeContact(), makeFakeContact()]
    };
};
