import { mount } from '@cypress/vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { engagementForm } from 'src/forms/engagement';
import { DataTest } from '../enums/enums';
import { FullDataTest, prettyVariable } from '../utils';
import { makeFakeEngagement } from '../factories/mock/engagement';
import { GenericRessource } from '../types/types';


describe('The RessourceForm', () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...fakeEngagement } = makeFakeEngagement();
    beforeEach(() => {
        mount(RessourceForm, {
            props: {
                ressourceFormConfig: engagementForm,
                ressource: fakeEngagement
            }
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