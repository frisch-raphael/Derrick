import { mount } from '@cypress/vue';
import { Dialog, Notify } from 'quasar';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import TemplateFindingTable from 'src/pages/RessourceTables/TemplateFindingTable.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { getDefaultConfigStore } from '../../../test/cypress/utils';
import { makeFakeConfig } from '../../factories/mock/config';

installQuasarPlugin({ plugins: { Dialog, Notify } });
describe('The TemplateFindingTable', () => {

    beforeEach(() => {
        cy.intercept('get', '/templatefindings', []).as('templatefindings');
        cy.intercept('get', '/config', makeFakeConfig());
        mount(TemplateFindingTable,
            {
                global: {
                    plugins: [createTestingPinia({
                        createSpy: (action: any) => cy.spy(action), stubActions: false
                    })]
                },
            }).as('wrapper');
        useUiStore();
        getDefaultConfigStore();

        Notify.setDefaults({ timeout: 10 });
    });

    it('test', () => {
        // test
    });
});
