import { mount } from '@cypress/vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { engagementForm } from 'src/forms/engagement';
import { DataTest } from '../enums/enums';
import { FullDataTest, prettyVariable } from '../utils/utils';
import { makeFakeEngagement } from '../factories/mock/engagement';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog, Notify } from 'quasar';
import { createTestingPinia } from '@pinia/testing';
import { useConfigStore } from 'src/stores/config';
import { makeFakeConfig } from '../factories/mock/config';
installQuasarPlugin({ plugins: { Dialog, Notify } });

const fakeConfig = makeFakeConfig();

describe('The RessourceForm', () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...fakeEngagement } = makeFakeEngagement();
    beforeEach(() => {
        mount(RessourceForm, {
            global: {
                plugins: [createTestingPinia({
                    createSpy: (action: any) => cy.spy(action), stubActions: false
                })]
            },
            props: {
                // ressourceFormConfig: engagementForm(useConfigStore(), fakeConfig.languages[0]),
                ressource: fakeEngagement
            }
        }).as('wrapper');
        const confStore = useConfigStore();
        confStore.assessmentTypesTranslations = fakeConfig.assessment_types;
        confStore.supportedLanguages = fakeConfig.languages;
        cy.get('@wrapper').invoke('setProps', { ressourceFormConfig: engagementForm });
    });

    // it('emits that ressource values initialized', () => {
    //     // cy.wrap(Cypress.vueWrapper).then((wrapper) => {
    //     expect(wrapper.emitted('defaultValuesDone')).to.have.length(1);
    // });
    // cy.get('@wrapper').invoke('emitted', 'defaultValuesDone').then((test) => {
    //     console.log(test);
    //     debugger;
    // });
    // });

    it('display error if title not filled', () => {
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).clear();
        cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceForm).should('contain', 'Title is required');
        });
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).type('azddfs').then(() => {
            cy.dataCy(DataTest.RessourceForm).should('not.contain', 'Title is required');
        });
    });

    it('has correct components for params : date, input, select...', () => {
        cy.get(FullDataTest(DataTest.EngagementFormStartDate)).should('exist');
        cy.get(FullDataTest(DataTest.EngagementFormAssessmentType)).should('exist');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).should('exist');
    });

    it('has correct labels', () => {
        for (const key in engagementForm) {
            cy.dataCy(DataTest.RessourceForm).contains(prettyVariable(key));
        }
    });

    it('has correct values', () => {
        cy.get("[data-test='form-title']").should('have.value', fakeEngagement.title);
        cy.get("[data-test='form-assessment_type']").should('contain.text', fakeEngagement.assessment_type);
        cy.get("[data-test='form-language']").should('contain.text', fakeEngagement.language);
        cy.get("[data-test='form-state']").should('contain.text', fakeEngagement.state);
        cy.get("[data-test='form-start_date']").should('have.value', fakeEngagement.start_date);
        cy.get("[data-test='form-end_date']").should('have.value', fakeEngagement.end_date);
    });

});