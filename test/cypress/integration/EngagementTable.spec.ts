import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { t } from 'app/test/cypress/utils';
import { IEngagement } from 'src/dtos/engagement';
import { DataTest } from 'src/enums/enums';
import { makeFakeEngagement } from 'src/factories/mock/engagement';
import { initRessourceFormWithEngagement, reinitRessourceFormWithEngagement } from '../utils';


describe('The EngagementTable', () => {

    beforeEach(() => {
        cy.visit('/', { timeout: 15000 });

    });

    it('can edit a ressource', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const editedEngagement = makeFakeEngagement();

        cy.dataCy(DataTest.RessourceTableCardUpdateBtn, { timeout: 15000 }).first().click().then(() => {

            reinitRessourceFormWithEngagement(editedEngagement);
            // cy.dataCy(DataTest.RessourceTableCreateEditBtn).click().then(() => {
            //     cy.dataCy(DataTest.DialogBase).should('not.exist');
            //     cy.get('.bg-negative.q-notification').should('exist');
            // });

            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-positive.q-notification').should('exist');
                // cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', `Engagement ${numberOfEngagementBefore + 1}`);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', 'new title');
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', '2222-12-22');
                cy.dataCy(DataTest.RessourceTableCard).first().invoke('text').should('match', /202\d-\d\d-10/);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.assessment_type);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.language);
            });

        });
    });


    it('can create new engagement', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, state, ...engagementToType } = makeFakeEngagement();
        cy.dataCy(DataTest.RessourceTableCard).then((originalCards) => {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
            cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click();
            initRessourceFormWithEngagement(engagementToType);

            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                const numberOfEngagementBefore = originalCards.length;
                cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-positive.q-notification').should('exist');
                cy.dataCy(DataTest.RessourceTableCard).should('have.length', numberOfEngagementBefore + 1);
                // cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', `Engagement ${numberOfEngagementBefore + 1}`);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.title);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', '1111-11-11');
                cy.dataCy(DataTest.RessourceTableCard).last().invoke('text').should('match', /.*202\d-\d\d-20.*/);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.assessment_type);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.language);
                cy.contains(engagementToType.title).should('exist');

            });

            // cy.get(FullDataTest(DataTest.RessourceForm)).click();
        });


    });

    it('close both menu and headers at the same time', () => {
        cy.dataCy(DataTest.RessourceTableHeaderCreateNew).should('not.exist');
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
        cy.dataCy(DataTest.RessourceTableHeaderCreateNew).should('exist');
        cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click();
        cy.dataCy(DataTest.RessourceForm).should('exist');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceForm).should('not.exist');
        cy.dataCy(DataTest.RessourceTableHeaderCreateNew).should('not.exist');
    });


    it('can delete engagement', () => {

        cy.dataCy(DataTest.RessourceTableCard).then((cards) => {
            const numberOfCards = cards.length;
            cy.dataCy(DataTest.RessourceTableCardDeleteBtn).first().click().then(() => {
                cy.get('.bg-positive.q-notification').should('exist');
                cy.dataCy(DataTest.RessourceTableCard).should('have.length', numberOfCards - 1);
            });
            //
        });
    });

    it('error popup if error', () => {
        cy.intercept('DELETE', '/engagements/*', {
            statusCode: 404
        });
        cy.intercept('POST', '/engagements/*', {
            statusCode: 404
        });
        cy.dataCy(DataTest.RessourceTableCard).then(() => {
            cy.dataCy(DataTest.RessourceTableCardDeleteBtn).first().click();
            cy.get('.bg-negative.q-notification').should('exist');
            //
        });
        cy.dataCy(DataTest.RessourceTableCard).then(() => {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
            cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click();
            cy.get(t('form-title')).type('test');
            cy.get(t('form-assessment_type')).type('test');
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.get('.bg-negative.q-notification').should('exist');

            });

            // cy.get(FullDataTest(DataTest.RessourceForm)).click();
        });
    });

});