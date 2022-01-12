import { mount } from '@cypress/vue';
import TheDrawer from 'src/components/TheDrawer.vue';
import { DataTest } from '../enums/enums';

describe('for the Drawer', () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeEach(() => {
        mount(TheDrawer, {
            props: {
                reportTitle: 'test'
            }
        });
    });

    it('header buttons change colors when selected', () => {
        cy.dataCy(DataTest.DrawerAdminBtn).click({ force: true }).then(() => {
            cy.dataCy(DataTest.DrawerAdminBtn).should('have.class', 'bg-primary');
            cy.dataCy(DataTest.DrawerReportBtn).should('not.have.class', 'bg-primary');
        });
        cy.dataCy(DataTest.DrawerReportBtn).click({ force: true }).then(() => {
            cy.dataCy(DataTest.DrawerReportBtn).should('have.class', 'bg-primary');
            cy.dataCy(DataTest.DrawerAdminBtn).should('not.have.class', 'bg-primary');
        });
    });


});