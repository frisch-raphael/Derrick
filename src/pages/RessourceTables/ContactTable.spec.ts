/* eslint-disable @typescript-eslint/unbound-method */
import { mount } from '@cypress/vue';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import ContactTable from 'src/pages/RessourceTables/ContactTable.vue';
import { makeFakeEngagement } from '../../factories/mock/engagement';
import { createRouter, createWebHistory } from 'vue-router';
import { DataTest } from '../../enums/enums';
import { createTestingPinia } from '@pinia/testing';
import { RessourceName } from 'src/enums/enums';
import { useUiStore } from 'src/stores/ui';
import { getDefaultConfigStore } from '../../../test/cypress/utils';


installQuasarPlugin({ plugins: { Dialog, Notify } });
const fakeEngagement = makeFakeEngagement();
const mockRouter = createRouter({ history: createWebHistory(), routes: [] });
mockRouter.currentRoute.value.query = { engagement: 'test engagement (from query param)' };


Notify.setDefaults({ timeout: 10 });

describe('The empty ContactTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/engagements/**', []).as('emptyContacts');
        mount(ContactTable,
            {
                props: { parentEngagementId: fakeEngagement.id },
                global: {
                    plugins: [mockRouter, createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
            }).as('wrapper');
        getDefaultConfigStore();
    });

    it('store load contacts', () => {
        const store = useUiStore();
        cy.wait('@emptyContacts').then(() => {
            expect(store.updateRessourceTable).to.have.been.calledWith(RessourceName.Contact, []);
        });
    });

    it('should have query engagement in title', () => {
        cy.dataCy(DataTest.RessourceTableHeaderTitle).should('contain.html', 'test engagement');
    });

    it('has a loading bar, then no data component', () => {
        const store = useUiStore();
        // await router.push({ name: 'contacts', params: { parentEngagement: fakeEngagement.id } });
        cy.dataCy(DataTest.RessourceTableOpenHeaderMenuBtn).click().then(() => {
            expect(store.updateRessourceMenu).to.have.been.calledWith(RessourceName.Contact, true);
            cy.dataCy(DataTest.RessourceTableHeaderDeleteAll).should('exist');
        });
    });

});
