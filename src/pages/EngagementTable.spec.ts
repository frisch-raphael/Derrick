import { mount } from '@cypress/vue';
import { DataTest } from 'src/enums/enums';

import { storeKey } from 'src/store';
import store from 'src/store/index';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import EngagementTable from 'src/pages/EngagementTable.vue';

installQuasarPlugin({ plugins: { Dialog, Notify } });

describe('The EngagementTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements', {
            statusCode: 200,
            body: makeFakeEngagements(5)
        }).as('engagements');

        // store.commit(MutationType.updateCreateEditRessourceState,
        //     {
        //         ressource: RessourceName.Engagement,
        //         isOpen: false,
        //         mode: 'create',
        //         ressourceToEdit: { id: 0 }
        //     });
        // store.commit(MutationType.updateRessourceTable,
        //     {
        //         ressource: RessourceName.Engagement,
        //         rows: fakeEngagementsInStore
        //     });
        mount(EngagementTable,
            {

                global: {
                    provide: { [(storeKey as any)]: store }
                },
            }).as('wrapper');
        Notify.setDefaults({ timeout: 200 });
        cy.wait('@engagements');
    });

    it('can open company', () => {
        cy.dataCy(DataTest.EngagementTableCompanyBtn).first().click();
        cy.dataCy(DataTest.RessourceForm).should('exist');
    });


});