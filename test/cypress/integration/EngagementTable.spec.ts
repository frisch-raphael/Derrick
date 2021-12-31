import { t } from 'app/test/cypress/utils';

describe('The EngagementTable', () => {
    it('close both menu and headers at the same time', () => {
        cy.visit('/');
        cy.get(t('add')).should('not.exist');
        cy.get(t('menu-btn')).click();
        cy.get(t('add')).should('exist');
        cy.get(t('add')).click();
        cy.get(t('ressource-form')).should('exist');
        cy.get(t('ressource-form')).type('{esc}');
        cy.get(t('ressource-form')).should('not.exist');
        cy.get(t('add')).should('not.exist');
        // expect(menu)

        // const engagementTable = await wrapperToAwait();

        // const menuButton = engagementTable.find("[data-test='menu-btn']");
        // expect(menuButton.exists()).toBe(true);

        // await menuButton.trigger('click');
        // const createButton = engagementTable.findComponent("[data-test='add']");
        // expect(createButton.exists()).toBe(true);

        // await(createButton as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        // const ressourceForm = engagementTable.findComponent((RessourceForm as any));
        // expect(ressourceForm.exists()).toBe(true);
        // cy.dataCy('header-admin-button').click();
        // cy.get("[data-test='Administration']").should('exist');
        // cy.dataCy('').click();
        // cy.get("[data-test='Docx']").should('exist');
        // cy.dataCy('header-admin-button').click();
        // cy.get("[data-test='Administration']").should('exist');
    });
});