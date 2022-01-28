import { mount } from '@cypress/vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { DataTest, RessourceName } from 'src/enums/enums';

import { makeFakeEngagement } from 'src/factories/mock/engagement';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog, Notify } from 'quasar';
import { FullDataTest } from 'src/utils/utils';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component
installQuasarPlugin({ plugins: { Dialog, Notify } });


const fakeEngagement = makeFakeEngagement();
describe('a CreateRessourceDialog', () => {

    beforeEach(() => {
        mount(CreateEditRessourceDialog,
            {
                global: {
                    plugins: [createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
                props: {
                    ressourceName: RessourceName.Engagement,
                }
            });
        const store = useUiStore();
        store.updateCreateEditRessourceState(
            {
                ressourceName: RessourceName.Engagement,
                isOpen: true,
                mode: 'edit',
                ressourceToEdit: fakeEngagement
            });

    });

    it('prints correct title', () => {
        cy.dataCy(DataTest.DialogBase).should('contain.text', `edit ${RessourceName.Engagement}`).then(() => {
            const store = useUiStore();
            store.updateCreateEditRessourceState(
                {
                    ressourceName: RessourceName.Engagement,
                    mode: 'create',
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