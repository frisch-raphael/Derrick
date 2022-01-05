import { mount } from '@cypress/vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { engagementForm } from 'src/forms/engagement';
import { DataTest } from '../enums/enums';
import { FullDataTest, prettyVariable } from '../utils';


describe('The RessourceForm', () => {


    it('has correct components for params : date, input, select...', () => {
        mount(RessourceForm, {
            props: {
                ressourceFormConfig: engagementForm
            }
        });
        cy.get(FullDataTest(DataTest.EngagementFormStartDate)).should('exist');
        cy.get(FullDataTest(DataTest.EngagementFormAssessmentType)).should('exist');
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).should('exist');
    });

    it('has correct labels', () => {
        mount(RessourceForm, {
            props: {
                ressourceFormConfig: engagementForm
            }
        });
        for (const key in engagementForm) {
            cy.dataCy(DataTest.RessourceForm).contains(prettyVariable(key));
        }
    });


});