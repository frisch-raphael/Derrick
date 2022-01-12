import { mount } from '@cypress/vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from 'src/store/columbo/mutations-types';
import { makeFakeEngagement } from 'src/factories/mock/engagement';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog, Notify } from 'quasar';
import { FullDataTest } from 'src/utils';
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component
installQuasarPlugin({ plugins: { Dialog, Notify } });


const fakeEngagement = makeFakeEngagement();
describe('a CreateRessourceDialog', () => {

    beforeEach(() => {
        store.commit(MutationType.updateCreateEditRessourceState,
            {
                ressource: RessourceName.Engagement,
                isOpen: true,
                mode: 'edit',
                ressourceToEdit: fakeEngagement
            });
        mount(CreateEditRessourceDialog,
            {
                global: {
                    provide: { [(storeKey as any)]: store }
                },
                props: {
                    ressourceName: RessourceName.Engagement,
                }
            });
    });

    it('prints correct title', () => {
        cy.dataCy(DataTest.DialogBase).should('contain.text', `edit ${RessourceName.Engagement}`).then(() => {
            store.commit(MutationType.updateCreateEditRessourceState,
                {
                    ressource: RessourceName.Engagement,
                    isOpen: true,
                    mode: 'create',
                    ressourceToEdit: fakeEngagement
                });
            cy.dataCy(DataTest.DialogBase).should('contain.text', `create new ${RessourceName.Engagement}`);
        });

    });

    it('stays if error', () => {
        cy.get(FullDataTest(DataTest.EngagementFormTitle)).clear();
        cy.dataCy(DataTest.RessourceFormCreateEditBtn).click().then(() => {

            cy.dataCy(DataTest.DialogBaseCard).should('exist');
        });
    });
});