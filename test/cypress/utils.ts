import { DataTest } from 'src/enums/enums';
import { IEngagement } from 'src/dtos/engagement';
import { IContact } from '../../src/dtos/contact';
import { useConfigStore } from 'src/stores/config';
import { makeFakeConfig } from 'src/factories/mock/config';
import ISO6391 from 'iso-639-1';
export const t = (string: string) => `[data-test=${string}]`;

export const initRessourceFormWithEngagement = (engagementToType: Omit<Omit<IEngagement, 'id'>, 'state'>, isLight = false) => {
    cy.get(t('form-language')).click();
    cy.get('span').contains(engagementToType.language).click();
    cy.get(t('form-title')).type(engagementToType.title);
    cy.get(t('form-assessment_type')).click();
    cy.get('span').contains(engagementToType.assessment_type).click();
    if (isLight) return;
    cy.get(t('form-start_date')).type('11111111');
    cy.get(t('form-end_date')).parent().prev().find(`[data-cy='${DataTest.FormDateOpenBtn}']`).click();
    cy.get('span').contains(/^20$/).click();
};

export const initRessourceFormWithContact = (contactToType: Omit<IContact, 'id'>) => {
    cy.get(t('form-first_name')).type(contactToType.first_name);
    cy.get(t('form-last_name')).type(contactToType.last_name);
    cy.get(t('form-phone')).type(contactToType.phone);
    cy.get(t('form-title')).type(contactToType.title);
};

export const reinitRessourceFormWithEngagement = (editedEngagement: Omit<IEngagement, 'id'>) => {
    cy.get(t('form-title')).clear();
    cy.get(t('form-title')).type('new title');
    cy.get(t('form-start_date')).clear();
    cy.get(t('form-start_date')).type('22221222');
    cy.get(t('form-end_date')).parent().prev().find(`[data-cy='${DataTest.FormDateOpenBtn}']`).click();
    cy.dataCy(DataTest.FormDateDialog).should('exist');
    cy.get('span').contains(/^10$/).click();
    cy.dataCy(DataTest.FormDateDialog).should('not.exist');
    cy.get(t('form-assessment_type')).click();
    cy.get('span').contains(editedEngagement.assessment_type).click();
    cy.get(t('form-state')).click();
    cy.get('span').contains(editedEngagement.state).click();
    cy.get(t('form-language')).click();
    cy.get('span').contains(editedEngagement.language).click();
};

export const verifyCardContainsContact = (contact: Partial<IContact>) => {
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', contact.first_name);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', contact.last_name);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', contact.phone);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', contact.title);
};

export const verifyCardContainsEngagement = (engagement: Partial<IEngagement>) => {
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', engagement.title);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', engagement.end_date);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', engagement.start_date);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', engagement.assessment_type);
    cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', engagement.language);
};

export const getDefaultConfigStore = () => {
    const confStore = useConfigStore();
    const fakeConfig = makeFakeConfig();
    confStore.assessmentTypesTranslations = fakeConfig.assessment_types;
    confStore.supportedLanguages = fakeConfig.languages.map(l => ISO6391.getName(l));
    return confStore;
};