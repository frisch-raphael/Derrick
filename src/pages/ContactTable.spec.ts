import { mount } from '@cypress/vue';

import { storeKey } from 'src/store';
import store from 'src/store/index';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import ContactTable from 'src/pages/ContactTable.vue';
import { makeFakeEngagement } from '../factories/mock/engagement';
import { useRouter } from 'vue-router';
import { DataTest } from '../enums/enums';

installQuasarPlugin({ plugins: { Dialog, Notify } });
const fakeEngagement = makeFakeEngagement();
const router = useRouter();
describe('The empty ContactTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements/**', { statusCode: 200, body: [] }).as('emptyContacts');
        mount(ContactTable,
            {
                props: { parentEngagementId: fakeEngagement.id },
                global: {
                    plugins: [router],
                    provide: { [(storeKey as any)]: store }
                },
            }).as('wrapper');
        Notify.setDefaults({ timeout: 10 });
    });


    it('has a loading bar, then no data component', () => {
        // await router.push({ name: 'contacts', params: { parentEngagement: fakeEngagement.id } });
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).should('exist');
        });
    });
});
