/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { makeFakeConfig } from 'src/factories/mock/config';
import { ApiRessource, DataTest } from 'src/enums/enums';
const mockEngagementNumber = 3;
const mockEngagements: IEngagement[] = makeFakeEngagements(mockEngagementNumber);
const mockEngagementsResponse = Promise.resolve({ data: mockEngagements });
const mockConfig: IColumboConfig = makeFakeConfig();
const mockConfigResponse = Promise.resolve({ data: mockConfig });
const mockFunction = jest.fn();
import { when } from 'jest-when';
when(mockFunction)
    .calledWith({ url: ApiRessource.Engagement, method: expect.anything() }).mockReturnValue(mockEngagementsResponse)
    .calledWith({ url: ApiRessource.Config, method: expect.anything() }).mockReturnValue(mockConfigResponse);
import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
// @ts-expect-error for some reason .vue does not work
import EngagementTable from 'src/pages/EngagementTable';
import { IEngagement } from 'src/dtos/engagement';
import RessourceForm from 'src/components/RessourceForm.vue';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import { IColumboConfig } from 'src/dtos/columboConfig';
import request from 'src/axios';
import { Dialog, Notify } from 'quasar';
import { createRouter, createWebHistory } from 'vue-router';
import { mount, flushPromises } from '@vue/test-utils';
import { FullDataCy } from 'src/utils/utils';
jest.mock('src/axios', () => {
    return { __esModule: true, default: mockFunction };
});
const mockRouter = createRouter({ history: createWebHistory(), routes: [] });
mockRouter.push = jest.fn();
installQuasarPlugin({ plugins: { Dialog, Notify } });


const factory = async () => {
    const wrapper = mount(EngagementTable, {
        global: {
            plugins: [mockRouter, createTestingPinia({ stubActions: false })]
        }
    });
    const confStore = useConfigStore();
    confStore.assessmentTypesTranslations = mockConfig.assessment_types;
    confStore.supportedLanguages = mockConfig.languages;
    await flushPromises();
    return wrapper;
};

describe('the engagement table', () => {

    it('can go to contacts', async () => {
        const wrapper = await factory();
        await wrapper.find(FullDataCy(DataTest.EngagementTableContactBtn)).trigger('click');

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(mockRouter.push).toHaveBeenCalledWith({
            name: 'contacts',
            params:
                { parentEngagementId: mockEngagements[0].id },
            query: { engagement: mockEngagements[0].title }
        });
    });

    it('load engagements on mount', () => {
        const store = useUiStore();
        expect(request).toHaveBeenCalledWith({ method: 'get', url: ApiRessource.Engagement });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(store.ressourceTableRows.engagement).toHaveLength(3);
    });

    it('load config on mount', () => {
        const configStore = useConfigStore();
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(configStore.fetchConfigTranslationEntries).toHaveBeenCalled();
    });

    it('display first engagement rows in html', async () => {
        const engagementTable = await factory();
        const testEngagement = mockEngagements[0];
        const valuesThatShouldBeInHtml = [
            testEngagement.title,
            testEngagement.end_date,
            testEngagement.language,
            testEngagement.assessment_type];
        valuesThatShouldBeInHtml.map(value => expect(engagementTable.html()).toContain(value));
    });

    it('can navigate to RessourceForm', async () => {

        const engagementTable = await factory();
        const menuButton = engagementTable.find("[data-cy='open-menu-btn']");
        expect(menuButton.exists()).toBe(true);

        await menuButton.trigger('click');
        const createButton = engagementTable.findComponent("[data-cy='" + DataTest.RessourceTableHeaderCreateNew + "']");
        expect(createButton.exists()).toBe(true);

        await (createButton as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        const ressourceForm = engagementTable.findComponent((RessourceForm as any));
        expect(ressourceForm.exists()).toBe(true);

    });

});
