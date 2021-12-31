import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import EngagementTable from 'src/pages/EngagementTable';
import { makeFakeEngagement } from 'src/factories/engagement';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import { mountSuspense } from '../../utils';
import RessourceForm from 'src/components/RessourceForm.vue';
import { createStore } from 'vuex';
import { Store } from 'src/store';
import { ColumboState } from 'src/store/columbo/state';
import { storeKey, State, useStore } from 'src/store/index';
import { flushPromises } from '@vue/test-utils';
import store from 'src/store/index';
// // Specify here Quasar config you'll need to test your component
installQuasarPlugin();

let engagementNumber = 3;
const mockEngagements: IEngagement[] = [];
while (engagementNumber--) mockEngagements[engagementNumber] = makeFakeEngagement();
const mockResponse = Promise.resolve({ data: mockEngagements });

jest.mock('src/axios', () => ({
    __esModule: true, // this property makes it work
    default: jest.fn(() => mockResponse),
}));


const wrapperToAwait = async () => {
    const wrapper = await mountSuspense(EngagementTable, {
        global: {
            provide: { [(storeKey as any)]: store }
        }
    });
    return wrapper.findComponent(EngagementTable);
};

describe('the engagement table', () => {


    it('load engagements on mount', async () => {
        const wrapper = await wrapperToAwait();
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({ method: 'get', url: '/engagements' });
        expect(wrapper.vm.engagementsRows).toHaveLength(3);
    });

    it('display first engagement rows in html', async () => {
        const engagementTable = await wrapperToAwait();

        const testEngagement = engagementTable.vm.engagementsRows[1];
        const valuesThatShouldBeInHtml = [
            testEngagement.title,
            testEngagement.end_date,
            testEngagement.language,
            testEngagement.assessment_type];

        valuesThatShouldBeInHtml.map(value => expect(engagementTable.html()).toContain(value));
    });

    it('can navigate to RessourceForm', async () => {

        const engagementTable = await wrapperToAwait();

        const menuButton = engagementTable.find("[data-test='menu-btn']");
        expect(menuButton.exists()).toBe(true);

        await menuButton.trigger('click');
        const createButton = engagementTable.findComponent("[data-test='add']");
        expect(createButton.exists()).toBe(true);

        await (createButton as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        const ressourceForm = engagementTable.findComponent((RessourceForm as any));
        expect(ressourceForm.exists()).toBe(true);

    });

});
