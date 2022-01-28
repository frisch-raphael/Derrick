import { mount } from '@cypress/vue';
import { DataTest } from 'src/enums/enums';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import EngagementTable from 'src/pages/EngagementTable.vue';
import { ICompany } from '../dtos/company';
import { makeFakeCompany } from '../factories/mock/company';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { createRouter, createWebHistory } from 'vue-router';
const mockRouter = createRouter({
    history: createWebHistory(), routes: [{
        path: '/engagement/:parentEngagementId/contacts',
        name: 'contacts',
        props: true,
        component: () => import('pages/ContactTable.vue')
        // children: [{ path: '', component: () => import('pages/ReportsTable.vue') }],
    }]
});

installQuasarPlugin({ plugins: { Dialog, Notify } });
const fakeEngagements = makeFakeEngagements(5);
fakeEngagements[0].company = undefined;
describe('The empty EngagementTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements', []).as('engagements');
        mount(EngagementTable,
            {
                global: {
                    plugins: [mockRouter, createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
            }).as('wrapper');
        useUiStore();
        Notify.setDefaults({ timeout: 10 });
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
        mockRouter.push = cy.spy();
        cy.intercept('get', '/engagements', {
            statusCode: 200,
            body: fakeEngagements
        }).as('engagements');

        mount(EngagementTable,
            {
                global: {
                    plugins: [mockRouter, createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
            }).as('wrapper');
        useUiStore();
    });


    it('push is called with right args', () => {
        cy.dataCy(DataTest.EngagementTableContactBtn).first().click().then(() => {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(mockRouter.push).to.have.been.called;
        });
    });

    it('can open company', () => {
        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click().then(() => {
            cy.dataCy(DataTest.RessourceForm).should('exist');
        });
        cy.dataCy(DataTest.DialogBaseClose).click().then(() => {
            cy.dataCy(DataTest.RessourceForm).should('not.exist');
        });
    });

    it('company is present inside card after creation', () => {
        const newEngagementCompany = makeFakeCompany();
        cy.intercept('POST', '/engagements/*/companies', { body: newEngagementCompany, delay: 200 });
        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click().then(() => {
            cy.get('[data-test="form-full_name"]').type('this wont matter data comes frop api');
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.get('.bg-positive.q-notification').should('exist');
                cy.get('.bg-positive.q-notification').contains(/create/).should('exist');
                cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click().then(() => {

                    for (const [key, value] of Object.entries(newEngagementCompany)) {
                        if (key == 'id') continue;

                        cy.get(`[data-test="form-${key}"]`).should('have.value', value);
                    }
                });
                cy.dataCy(DataTest.RessourceForm).type('{esc}');
            });
        });
    });

    it('company is present inside card after update', () => {
        const editedEngagementCompany = makeFakeCompany();
        cy.intercept('PUT', '/engagements/*/companies/*', { body: editedEngagementCompany, delay: 100 });
        cy.dataCy(DataTest.EngagementTableCompanyBtn).last().click().then(() => {
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCardLoading).last().should('not.have.attr', 'aria-valuenow');
                cy.contains(/' updated/).should('exist');
                cy.dataCy(DataTest.EngagementTableCompanyBtn).last().click().then(() => {
                    for (const [key, value] of Object.entries(editedEngagementCompany)) {
                        if (key == 'id') continue;
                        cy.get(`[data-test="form-${key}"]`).should('have.value', value);
                    }
                    cy.dataCy(DataTest.RessourceForm).type('{esc}');
                });
            });
        });
        cy.dataCy(DataTest.RessourceForm).type('{esc}');

    });

    it('send correct params to api', () => {
        cy.intercept('POST', '/engagements/*/companies', {}).as(
            'company'
        );

        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click().then(() => {
            // cy.dataCy(DataTest.CompanyFormFullName).type('')
            for (const key of Object.keys(fakeEngagements[1].company as ICompany)) {
                if (key == 'id') continue;
                cy.get(`[data-test="form-${key}"]`).type('test' + key);
            }
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.wait('@company');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars

                for (const key of Object.keys(fakeEngagements[1].company as ICompany)) {
                    if (key == 'id') continue;
                    cy.get('@company').its(`request.body.company.${key}`).should('equal', 'test' + key);
                }
            });

        });
    });

});