import { t } from 'app/test/cypress/utils';
import { DataTest } from 'src/enums/enums';

describe('The EngagementTable', () => {

    beforeEach(() => {
        cy.visit('/', { timeout: 15000 });

    });

    it('close both menu and headers at the same time', () => {
        cy.dataCy('add').should('not.exist');
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn, { timeout: 15000 }).click();
        cy.dataCy('add').should('exist');
        cy.dataCy('add').click();
        cy.dataCy(DataTest.RessourceForm).should('exist');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceForm).should('not.exist');
        cy.dataCy('add').should('not.exist');
    });

    it('can create new engagement', () => {

        cy.dataCy(DataTest.RessourceTableCard).then((originalCards) => {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
            cy.dataCy('add').click();
            const engagementTitle = 'Test interne société Contos';
            cy.get(t('form-title')).type(engagementTitle);
            cy.dataCy(DataTest.RessourceTableCreateBtn).click().then(() => {
                const numberOfEngagementBefore = originalCards.length;
                cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-positive.q-notification').should('exist');
                cy.dataCy(DataTest.RessourceTableCard).should('have.length', numberOfEngagementBefore + 1);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', `Engagement ${numberOfEngagementBefore + 1}`);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementTitle);
                cy.contains(engagementTitle).should('exist');

            });

            // cy.get(FullDataTest(DataTest.RessourceForm)).click();
        });


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

    it('error popup if id does not exist', () => {
        cy.intercept('DELETE', '/engagements/*', {
            statusCode: 404
        });
        cy.intercept('GET', '/engagements/*', {
            statusCode: 404
        });
        cy.dataCy(DataTest.RessourceTableCard).then(() => {
            cy.dataCy(DataTest.RessourceTableCardDeleteBtn).first().click();
            cy.get('.bg-negative.q-notification').should('exist');
            //
        });


        // cy.get(FullDataTest(DataTest.RessourceForm)).click();
    });

});