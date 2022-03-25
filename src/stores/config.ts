import { defineStore } from 'pinia';
import { ConfigTranslationEntries } from 'src/types/types';
import RestClient from '../classes/api/restClient';
import { RessourceName } from '../enums/enums';
import { IColumboConfig } from '../dtos/columboConfig';
import ISO6391 from 'iso-639-1';

export type LanguageSpecificConfig = {
    assessmentTypes: string[],
    translatedFindingtypes: string[]
}


export const useConfigStore = defineStore('config', {
    state: () => ({
        assessmentTypesTranslations: [] as ConfigTranslationEntries | undefined,
        findingTypesTranslations: [] as ConfigTranslationEntries | undefined,
        hackerProfilesTranslations: [] as ConfigTranslationEntries | undefined,
        supportedLanguages: [] as string[] | undefined,
    }),
    getters: {
        languageSpecificConfig: (state) => (languageCode: string) => {
            const translatedAssessmentTypes = state.assessmentTypesTranslations?.map(a => a[languageCode]);
            const translatedFindingtypes = state.findingTypesTranslations?.map(a => a[languageCode]);
            return { assessmentTypes: translatedAssessmentTypes, translatedFindingtypes: translatedFindingtypes };
        },
    },
    actions: {
        async fetchConfigTranslationEntries() {
            const config = await new RestClient(RessourceName.ColumboConfig).index() as unknown as IColumboConfig;
            this.assessmentTypesTranslations = config.assessment_types;
            this.findingTypesTranslations = config.finding_types;
            this.hackerProfilesTranslations = config.hacker_profiles;
            this.supportedLanguages = config.languages.map(code => ISO6391.getName(code));
        }
        // storeAssessmentTypesTranslation(assessmentTypesTranslation: ConfigTranslationEntry) {
        //     this.assessmentTypesTranslation = assessmentTypesTranslation;
        // },
        // storeFindingTypesTranslation(findingTypesTranslation: ConfigTranslationEntry) {
        //     this.findingTypesTranslation = findingTypesTranslation;
        // },
    },
});
