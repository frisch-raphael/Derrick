
describe("The pannel", () => {
    it("can switch between admin and engagement", () => {
        cy.visit("/");

        cy.dataCy('header-admin-button').click();
        cy.get("[data-test='Administration']").should('exist');
        cy.dataCy("").click();
        cy.get("[data-test='Docx']").should('exist');
        cy.dataCy('header-admin-button').click();
        cy.get("[data-test='Administration']").should('exist');
        // cy.contains("New message");
    });
});