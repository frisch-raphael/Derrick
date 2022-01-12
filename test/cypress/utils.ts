import { DataTest } from 'src/enums/enums';
import { IEngagement } from 'src/dtos/engagement';
export const t = (string: string) => `[data-test=${string}]`;

export const initRessourceFormWithEngagement = (engagementToType: Omit<Omit<IEngagement, 'id'>, 'state'>) => {

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
};

export const reinitRessourceFormWithEngagement = (editedEngagement: Omit<IEngagement, 'id'>) => {

    cy.get(t('form-title')).clear().then(() => {
        cy.get(t('form-title')).type('new title');
    });
    cy.get(t('form-start_date')).clear().then(() => {
        cy.get(t('form-start_date')).type('22221222');
    });
    cy.get(t('form-end_date')).parent().prev().find(`[data-cy='${DataTest.FormDateOpenBtn}']`).click().then(() => {
        cy.dataCy(DataTest.FormDateDialog).should('exist');

        cy.get('span').contains(/^10$/).click().then(() => {
            cy.dataCy(DataTest.FormDateDialog).should('not.exist');
        });
    });
    // cy.get('span').contains(engagementToType.state).click();
    cy.get(t('form-assessment_type')).click();
    cy.get('span').contains(editedEngagement.assessment_type).click();
    cy.get(t('form-state')).click();
    cy.get('span').contains(editedEngagement.state).click();
    cy.get(t('form-language')).click();
    cy.get('span').contains(editedEngagement.language).click();
};