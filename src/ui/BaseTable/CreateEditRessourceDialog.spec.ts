import { mount } from '@cypress/vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import { makeFakeEngagement } from 'src/factories/mock/engagement';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog, Notify } from 'quasar';
import { FullDataTest } from 'src/utils/utils';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import { makeFakeConfig } from 'src/factories/mock/config';
import ISO6391 from 'iso-639-1';
import { initRessourceFormWithEngagement } from '../../../test/cypress/utils';
import { GenericRessource } from 'src/types/types';
import { makeFakeCompany } from 'src/factories/mock/company';
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component
installQuasarPlugin({ plugins: { Dialog, Notify } });
Notify.setDefaults({ timeout: 10 });
const fakeEngagement = makeFakeEngagement();
fakeEngagement.language = 'French';
fakeEngagement.assessment_type = 'Interne';
const fakeConfig = makeFakeConfig();

const mountRessource = (
    mode: 'edit' | 'create',
    ressource: { ressourceName: RessourceName, ressourceData: GenericRessource },
    parentRessource?: { ressourceName: RessourceName, ressourceData: GenericRessource },
) => {
    mount(CreateEditRessourceDialog,
        {
            global: {
                plugins: [createTestingPinia({
                    createSpy: (action: any) => cy.spy(action), stubActions: false
                })]
            },
            props: {
                ressourceName: ressource.ressourceName,
            }
        }).as('wrapper');
    const store = useUiStore();

    if (parentRessource) {
        store.updateCreateEditRessourceState(
            {
                ressourceName: ressource.ressourceName,
                isOpen: true,
                mode: mode,
                ressourceToEdit: mode === 'edit' ? ressource.ressourceData : undefined,
                isParentStoreTarget: true,
                parentRessource: parentRessource
            });
    } else {
        store.updateCreateEditRessourceState(
            {
                ressourceName: ressource.ressourceName,
                isOpen: true,
                mode: mode,
                ressourceToEdit: mode === 'edit' ? ressource.ressourceData : undefined
            });
    }
    const confStore = useConfigStore();
    confStore.assessmentTypesTranslations = fakeConfig.assessment_types;
    confStore.supportedLanguages = fakeConfig.languages.map(l => ISO6391.getName(l));
};

const mountEngagement = (mode: 'edit' | 'create') => {
    const ressource = {
        ressourceName: RessourceName.Engagement, ressourceData: fakeEngagement
    };
    mountRessource(mode, ressource);
};

const mountCompany = (mode: 'edit' | 'create') => {
    const ressource = {
        ressourceName: RessourceName.Company, ressourceData: makeFakeCompany()
    };
    const parentRessource = {
        ressourceName: RessourceName.Engagement, ressourceData: makeFakeEngagement()
    };
    mountRessource(mode, ressource, parentRessource);
};



describe('a CreateRessourceDialog', () => {
    beforeEach(() => {
        cy.intercept('POST', '/engagements', {}).as('engagementCreated');
        cy.intercept('PUT', '/engagements/*', {}).as('engagementModified');
    });

    it('assessment type gets translated when language change', () => {
        mountEngagement('edit');
        cy.get(FullDataTest(DataTest.EngagementFormLanguage)).click().then(() => {
            cy.get('span').contains('English').click();
        });
        cy.get(FullDataTest(DataTest.EngagementFormAssessmentType)).closest('.q-select').should('contain.text', 'Internal');
    });

    it('prints correct title', () => {
        mountEngagement('edit');
        cy.dataCy(DataTest.DialogBase).should('contain.text', `edit ${RessourceName.Engagement}`).then(() => {
            const store = useUiStore();
            store.updateCreateEditRessourceState(
                {
                    ressourceName: RessourceName.Engagement,
                    mode: 'create',
                });
            cy.dataCy(DataTest.DialogBase).should('contain.text', `create new ${RessourceName.Engagement}`);
        });
    });
    it('dialog stays if rule error', () => {
        mountEngagement('edit');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).clear();
        cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
            cy.dataCy(DataTest.DialogBaseCard).should('exist');
        });
    });

    it('when modified (edit), confirmation popup does NOT appear after SUBMIT', () => {
        mountEngagement('edit');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).type('a');
        cy.dataCy(DataTest.RessourceFormCreateEditBtn).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
        cy.wait('@engagementModified');
    });

    it('when modified (edit), confirmation popup DOES appear after CLOSE', () => {
        mountEngagement('edit');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).type('a');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('exist');
    });

    it('when modified (create), confirmation popup does NOT appear after SUBMIT', () => {
        mountEngagement('create');
        initRessourceFormWithEngagement(makeFakeEngagement(), true);
        cy.dataCy(DataTest.RessourceFormCreateEditBtn).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
        cy.wait('@engagementCreated');
    });

    it('when modified (create), confirmation popup DOES appear after CLOSE', () => {
        mountEngagement('create');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).type('a');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('exist');
    });

    it('when not modified (create), confirmation popup DOES NOT appear after CLOSE', () => {
        mountEngagement('create');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
    });

    it('when not modified (create - parentRessource), confirmation popup DOES NOT appear after CLOSE', () => {
        mountCompany('create');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
    });

    it('when not modified (edit), confirmation popup DOES NOT appear after CLOSE', () => {
        mountEngagement('edit');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
    });

    it('when not modified (edit - parentRessource), confirmation popup DOES NOT appear after CLOSE', () => {
        mountCompany('edit');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceFormConfirmation).should('not.exist');
    });
});