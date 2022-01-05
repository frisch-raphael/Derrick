import { mount } from '@cypress/vue';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import RestClient from 'src/classes/api/engagement';
import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from '../../store/columbo/mutations-types';
import { ApiRessource } from '../../enums/enums';
import { t } from 'app/test/cypress/utils';
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


    it('can select all cards at once', () => {

        cy.dataCy(DataTest.RessourceTableSelectAll).click().then(() => {
            cy.dataCy(DataTest.RessourceTableCardCheckbox).should((card) => {
                const isChecked = card.attr('aria-checked');
                expect(isChecked).to.be.equal('true');
            });
        });
    });

    it('can delete all cards at once', () => {

        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).click().then(() => {
                cy.dataCy(DataTest.RessourceTableCard).should('be.empty');
            });
        });
    });
    // it('can create new ressource', () => {

    //     cy.dataCy(DataTest.BaseTableCard).then((originalCards) => {
    //         cy.dataCy(DataTest.BaseTableOpenHeaderMenuBtn).click();
    //         cy.dataCy('add').click();
    //         const engagementTitle = 'Test interne société Contos';
    //         cy.get(t('form-title')).type(engagementTitle);
    //         cy.dataCy(DataTest.EngagementCreateBtn).click().then(() => {
    //             const numberOfEngagementBefore = originalCards.length;
    //             cy.dataCy(DataTest.DialogBase).should('not.exist');
    //             cy.get('.bg-positive.q-notification').should('exist');
    //             cy.dataCy(DataTest.BaseTableCard).should('have.length', numberOfEngagementBefore + 1);
    //             (cy.dataCy(DataTest.BaseTableCard).first()).should('contain.text', `engagement ${numberOfEngagementBefore + 1}`);
    //             cy.contains(engagementTitle).should('exist');

    //         });

    //         // cy.get(FullDataTest(DataTest.RessourceForm)).click();
    //     });
    // });
});