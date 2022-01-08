import { mount } from '@cypress/vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from 'src/store/columbo/mutations-types';
import { makeFakeEngagement } from 'src/factories/mock/engagement';
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component


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


});