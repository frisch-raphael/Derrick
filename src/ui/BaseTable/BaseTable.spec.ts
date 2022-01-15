import { mount } from '@cypress/vue';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import RestClient from 'src/classes/api/restClient';
import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from 'src/store/columbo/mutations-types';
import { makeFakeEngagements, makeFakeEngagement } from 'src/factories/mock/engagement';
import { engagementColumns } from 'src/pages/columns';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { FullDataTest } from '../../utils';
import { initRessourceFormWithEngagement } from '../../../test/cypress/utils';

installQuasarPlugin({ plugins: { Dialog, Notify } });
const columns = engagementColumns;

const fakeEngagementsInStore = makeFakeEngagements(5);
describe('The BaseTable', () => {

    beforeEach(() => {
        store.commit(MutationType.updateCreateEditRessourceState,
            {
                ressource: RessourceName.Engagement,
                isOpen: false,
                mode: 'create',
                ressourceToEdit: { id: 0 }
            });
        store.commit(MutationType.updateRessourceTable,
            {
                ressource: RessourceName.Engagement,
                rows: fakeEngagementsInStore
            });
        mount(BaseTable,
            {

                global: {
                    provide: { [(storeKey as any)]: store }
                },
                props: {
                    grid: true,
                    columns: columns,
                    ressourceName: RessourceName.Engagement,
                    restClient: new RestClient(RessourceName.Engagement)
                }
            }).as('wrapper');
        Notify.setDefaults({ timeout: 200 });

    });

    it('has load bars for edit, create', () => {
        cy.intercept('POST', '/engagements', { delay: 500 }).as('createEngagement');
        cy.intercept('PUT', '/engagements/*', { delay: 500 }).as('updateEngagement');
        // edit
        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {

            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
                cy.dataCy(DataTest.RessourceTableCardLoading).first().should('not.have.attr', 'aria-valuenow').then(() => {
                    cy.wait('@updateEngagement', { timeout: 10000 }).then(() => {
                        cy.dataCy(DataTest.RessourceTableCardLoading).first().should('have.attr', 'aria-valuenow');
                    });
                });
            });
        });
        // create
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderCreateNew).click().then(() => {
                initRessourceFormWithEngagement(makeFakeEngagement());
                cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {

                    cy.dataCy(DataTest.RessourceTableLoading, { timeout: 10000 }).should('not.have.attr', 'aria-valuenow').then(() => {
                        cy.wait('@createEngagement', { timeout: 10000 }).then(() => {
                            cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
                        });
                    });
                });
            });
        });
    });

    it('send correct params to api', () => {
        cy.intercept('PUT', '/engagements/*', {}).as(
            'engagement'
        );

        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {
            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.wait('@engagement');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { company, ...fakeEngagement } = fakeEngagementsInStore[0];
                for (const [key, value] of Object.entries(fakeEngagement)) {
                    cy.get('@engagement').its(`request.body.${key}`).should('equal', value);
                }
            });

        });
    });

    it('can edit a ressource', () => {
        const editedEngagement = makeFakeEngagement();
        editedEngagement.id = fakeEngagementsInStore[0].id;
        cy.intercept('PUT', '/engagements/*', {
            statusCode: 200,
            body: editedEngagement
        });
        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).first().click().then(() => {

            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-positive.q-notification').should('exist');
                // cy.dataCy(DataTest.RessourceTableCard).last().should('contain.text', `Engagement ${numberOfEngagementBefore + 1}`);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.title);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.end_date);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.start_date);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.assessment_type);
                cy.dataCy(DataTest.RessourceTableCard).first().should('contain.text', editedEngagement.language);
            });

        });
    });


    it('error popup', () => {
        Notify.create({});

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cy.intercept('PUT', '/engagements/*', {
            statusCode: 404,
            body: {}
        });
        store.commit(MutationType.createEditOneRessourceTableRow, {
            ressource: RessourceName.Engagement,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            row: makeFakeEngagement()
        });

        cy.dataCy(DataTest.RessourceTableCardUpdateBtn).last().click().then(() => {

            cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {
                // cy.dataCy(DataTest.DialogBase).should('not.exist');
                cy.get('.bg-negative.q-notification').should('exist');
                cy.get('.bg-negative.q-notification').should('contain.text', `could not edit ${RessourceName.Engagement}`);
            });

        });
    });


    it('can filter cards', () => {
        cy.dataCy(DataTest.RessourceTableSearchInput).click().type('dsfdsfdsfdsfsfezfzef');
        cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
    });

    it('has different style for selected card', () => {

        cy.dataCy(DataTest.RessourceTableCard).first().should('not.have.class', 'bg-primary');
        cy.dataCy(DataTest.RessourceTableCardCheckbox).first().trigger('click').then(() => {
            cy.dataCy(DataTest.RessourceTableCard).first().should('have.class', 'bg-primary');
        });
    });

    it('display the right number of row', () => {
        cy.dataCy(DataTest.RessourceTableCard).should('have.lengthOf', fakeEngagementsInStore.length);
    });

    it('does not display "no data" warning when rows > 0', () => {
        cy.dataCy('no-data').should('not.exist');

    });

    it('display "no data" warning when no rows, but no loading bar', () => {
        store.commit(MutationType.updateRessourceTable, { ressource: RessourceName.Engagement, rows: [] });
        cy.dataCy('no-data').should('exist');
        cy.dataCy(DataTest.RessourceTableLoading).should('have.attr', 'aria-valuenow');
    });

    it('"delete all" disabled if nothing checked', () => {
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).should('have.class', 'disabled');
        });
    });

    it('can select/unselect all ressources at once', () => {

        cy.dataCy(DataTest.RessourceTableSelectAll).click().then(() => {
            cy.dataCy(DataTest.RessourceTableCardCheckbox).should((card) => {
                const isChecked = card.attr('aria-checked');
                expect(isChecked).to.be.equal('true');
            });
        });
        cy.dataCy(DataTest.RessourceTableSelectAll).click().then(() => {
            cy.dataCy(DataTest.RessourceTableCardCheckbox).should((card) => {
                const isChecked = card.attr('aria-checked');
                expect(isChecked).to.be.equal('false');
            });
        });
    });

    it('can delete all cards at once', () => {
        cy.dataCy(DataTest.RessourceTableSelectAll).click();
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
            });
        });
    });

    it('can update a ressource', () => {
        cy.dataCy(DataTest.RessourceTableSelectAll).click();
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCard).should('not.exist');
            });
        });
    });

});