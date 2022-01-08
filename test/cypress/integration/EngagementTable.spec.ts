import { t } from 'app/test/cypress/utils';
import { IEngagement } from 'src/dtos/engagement';
import { DataTest } from 'src/enums/enums';
import { makeFakeEngagement } from 'src/factories/mock/engagement';

describe('The EngagementTable', () => {

    beforeEach(() => {
        cy.visit('/', { timeout: 15000 });

    });


    it('can create new engagement', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, state, ...engagementToType } = makeFakeEngagement();
        cy.dataCy(DataTest.RessourceTableCard).then((originalCards) => {
            cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click();
            cy.dataCy('add').click();
            cy.get(t('form-title')).type(engagementToType.title);
            cy.get(t('form-start_date')).type('11111111');
            // cy.get(t('form-end_date')).type(engagementToType.end_date.toISOString());
            cy.get(t('form-end_date')).parent().prev().find(`[data-cy='${DataTest.FormDateOpenBtn}']`).click().then(() => {
                cy.dataCy(DataTest.FormDateDialog).should('exist');

                cy.get('span').contains(/^20$/).click().then(() => {
                    cy.dataCy(DataTest.FormDateDialog).should('not.exist');
                });
            });
            // cy.get('span').contains(engagementToType.state).click();
            cy.get(t('form-assessment_type')).click();
            cy.get('span').contains(engagementToType.assessment_type).click();
            cy.get(t('form-language')).click();
            cy.get('span').contains(engagementToType.language).click();
            cy.dataCy(DataTest.RessourceTableCreateBtn).click().then(() => {
                const numberOfEngagementBefore = originalCards.length;
                cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-positive.q-notification').should('exist');
                cy.dataCy(DataTest.RessourceTableCard).should('have.length', numberOfEngagementBefore + 1);
                // cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', `Engagement ${numberOfEngagementBefore + 1}`);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.title);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', '1111-11-11');
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', '2022-01-20');
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.assessment_type);
                cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', engagementToType.language);
                cy.contains(engagementToType.title).should('exist');

            });

            // cy.get(FullDataTest(DataTest.RessourceForm)).click();
        });


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
            cy.dataCy('add').click();
            cy.get(t('form-title')).type('test');
            cy.get(t('form-assessment_type')).type('test');
            cy.dataCy(DataTest.RessourceTableCreateBtn).click().then(() => {
                cy.get('.bg-negative.q-notification').should('exist');

            });

            // cy.get(FullDataTest(DataTest.RessourceForm)).click();
        });
    });

});