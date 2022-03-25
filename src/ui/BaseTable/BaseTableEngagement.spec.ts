import { mount } from '@cypress/vue';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { DataTest, RessourceName } from 'src/enums/enums';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { ressourceConfig } from 'src/utils/utils';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import { makeFakeConfig } from 'src/factories/mock/config';
import { FullDataTest } from '../../utils/utils';
import ISO6391 from 'iso-639-1';

installQuasarPlugin({ plugins: { Dialog, Notify } });

const fakeEngagement = makeFakeEngagements(5);
const fakeConfig = makeFakeConfig();
describe('The BaseTable mounted with engagements', () => {

    beforeEach(() => {

        mount(BaseTable,
            {
                global: {
                    plugins: [createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
                props: {
                    grid: true,
                    columns: ressourceConfig.engagement.columns,
                    ressourceName: RessourceName.Engagement
                }
            }).as('wrapper');
        const store = useUiStore();
        const confStore = useConfigStore();
        confStore.assessmentTypesTranslations = fakeConfig.assessment_types;
        confStore.supportedLanguages = fakeConfig.languages.map(l => ISO6391.getName(l));

        store.updateCreateEditRessourceState(
            {
                ressourceName: RessourceName.Engagement,
                isOpen: false,
                mode: 'create',
            });
        store.updateRessourceTable(RessourceName.Engagement, fakeEngagement);
        Notify.setDefaults({ timeout: 200 });
    });

    it('translated param still valid after language changed in another ressource', () => {
        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click();
        cy.get(FullDataTest(DataTest.EngagementFormAssessmentType)).children('span').invoke('text').as('firstLanguageValue');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).last().click();
        cy.get(FullDataTest(DataTest.EngagementFormLanguage)).click();
        cy.get('span').contains(ISO6391.getName(fakeConfig.languages[1])).click();
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.CreateEditConfirmClose).click();
        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click();
        cy.get(FullDataTest(DataTest.EngagementFormAssessmentType)).children('span').invoke('text').then((text) => {
            cy.get('@firstLanguageValue').should('equal', text);
        });
    });

    it('when not modified (create) multiple times, confirmation popup DOES NOT appear after CLOSE', () => {
        for (let i = 0; i < 2; i++) {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
            cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click();
            cy.dataCy(DataTest.DialogBaseClose).click();
            cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
        }
    });

});
