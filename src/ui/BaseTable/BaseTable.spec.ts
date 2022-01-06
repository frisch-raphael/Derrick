import { mount } from '@cypress/vue';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import RestClient from 'src/classes/api/engagement';
import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from 'src/store/columbo/mutations-types';
import { ApiRessource } from 'src/enums/enums';
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component

const columns = [
    {
        name: 'name',
        required: true,
        label: 'Dessert (100g serving)',
        align: 'left',
        field: 'name',
        sortable: true
    },
    { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
    { name: 'fat', label: 'Fat (g)', field: 'fat' }
];

const rows = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        id: 1
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        id: 2
    }
];

describe('The BaseTable', () => {

    beforeEach(() => {
        store.commit(MutationType.updateRessourceTable, { ressource: RessourceName.Engagement, rows: rows });
        mount(BaseTable,
            {
                global: {
                    provide: { [(storeKey as any)]: store }
                },
                props: {
                    grid: true,
                    columns: columns,
                    ressourceName: RessourceName.Engagement,
                    restClient: new RestClient(ApiRessource.Engagement)
                }
            });
    });

    it('has different style for selected card', () => {

        cy.dataCy(DataTest.RessourceTableCard).first().then((baseTableCard) => {
            const unclickedBaseTableCardClassesNumber = baseTableCard.attr('class')?.split(' ').length ?? 0;
            cy.dataCy(DataTest.RessourceTableCardCheckbox).first().trigger('click').then(() => {
                cy.dataCy(DataTest.RessourceTableCard).first().then((baseTableCard) => {
                    const clickedBaseTableCardClassesNumber = baseTableCard.attr('class')?.split(' ').length ?? 0;

                    expect(clickedBaseTableCardClassesNumber).equal(unclickedBaseTableCardClassesNumber + 1);
                });
            });
        });
    });

    it('display the right number of row', () => {
        cy.dataCy(DataTest.RessourceTableCard).should('have.lengthOf', rows.length);
    });

    it('does not display "no data" warning when rows > 0', () => {
        cy.dataCy('no-data').should('not.exist');
    });

    it('display "no data" warning when rows > 0', () => {
        store.commit(MutationType.updateRessourceTable, { ressource: RessourceName.Engagement, rows: [] });
        cy.dataCy('no-data').should('exist');
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