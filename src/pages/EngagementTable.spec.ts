import { mount } from '@cypress/vue';
import { DataTest } from 'src/enums/enums';

import { storeKey } from 'src/store';
import store from 'src/store/index';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import EngagementTable from 'src/pages/EngagementTable.vue';
import { ICompany } from '../dtos/company';

installQuasarPlugin({ plugins: { Dialog, Notify } });
const fakeEngagements = makeFakeEngagements(5);
fakeEngagements[0].company = undefined;
describe('The empty EngagementTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements', {
            statusCode: 200
        }).as('engagements');

        mount(EngagementTable,
            {

                global: {
                    provide: { [(storeKey as any)]: store }
                },
            }).as('wrapper');
        Notify.setDefaults({ timeout: 200 });
    });


    it('has a loading bar, then no data component', () => {
        cy.dataCy(DataTest.EngagementTableLoading).should('not.have.attr', 'aria-valuenow');
        cy.dataCy(DataTest.RessourceFormNoData).should('not.exist');
        cy.wait('@engagements');
        cy.dataCy(DataTest.EngagementTableLoading).should('not.exist');
        cy.dataCy(DataTest.RessourceFormNoData).should('exist');
    });
});


describe('The EngagementTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements', {
            statusCode: 200,
            body: fakeEngagements
        }).as('engagements');


        mount(EngagementTable,
            {

                global: {
                    provide: { [(storeKey as any)]: store }
                },
            }).as('wrapper');
        Notify.setDefaults({ timeout: 200 });
    });

    it('can open company', () => {
        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click();
        cy.dataCy(DataTest.RessourceForm).should('exist');
        cy.dataCy(DataTest.DialogBaseClose).click();
        cy.dataCy(DataTest.RessourceForm).should('not.exist');
    });

    it('send correct params to api', () => {
        cy.intercept('POST', '/engagements/*/companies', {}).as(
            'company'
        );


        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click().then(() => {
            // cy.dataCy(DataTest.CompanyFormFullName).type('')
            for (const key of Object.keys(fakeEngagements[1].company as ICompany)) {
                cy.get(`[data-test="form-${key}"]`).type('test' + key);
            }
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.wait('@company');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars

                for (const key of Object.keys(fakeEngagements[1].company as ICompany)) {
                    cy.get('@company').its(`request.body.${key}`).should('equal', 'test' + key);
                }
            });

        });
    });

});