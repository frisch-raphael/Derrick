import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import EngagementTable from 'src/pages/EngagementTable';
import { makeFakeEngagements } from 'src/factories/mock/engagement';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import { mountSuspense } from '../../utils';
import RessourceForm from 'src/components/RessourceForm.vue';
import { storeKey } from 'src/store/index';
import store from 'src/store/index';
import { ApiRessource } from 'src/enums/enums';
import { RessourceName } from 'src/enums/enums';
// // Specify here Quasar config you'll need to test your component

// const store = useStore();
installQuasarPlugin();
const engagementNumber = 3;
const mockEngagements: IEngagement[] = makeFakeEngagements(engagementNumber);
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
        await wrapperToAwait();
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({ method: 'get', url: ApiRessource.Engagement });
        expect(store.getters.baseTableRows(RessourceName.Engagement)).toHaveLength(3);
    });

    it('display first engagement rows in html', async () => {
        const engagementTable = await wrapperToAwait();

        const testEngagement = mockEngagements[0];
        const valuesThatShouldBeInHtml = [
            testEngagement.title,
            testEngagement.end_date,
            testEngagement.language,
            testEngagement.assessment_type];

        valuesThatShouldBeInHtml.map(value => expect(engagementTable.html()).toContain(value));
    });

    it('can navigate to RessourceForm', async () => {

        const engagementTable = await wrapperToAwait();
        const menuButton = engagementTable.find("[data-cy='open-menu-btn']");
        expect(menuButton.exists()).toBe(true);

        await menuButton.trigger('click');
        const createButton = engagementTable.findComponent("[data-cy='add']");
        expect(createButton.exists()).toBe(true);

        await (createButton as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        const ressourceForm = engagementTable.findComponent((RessourceForm as any));
        expect(ressourceForm.exists()).toBe(true);

    });


    it('add to store when engagement created', async () => {

        const engagementTable = await wrapperToAwait();
        const menuButton = engagementTable.find("[data-cy='open-menu-btn']");

        await menuButton.trigger('click');
        const openCreateButton = engagementTable.findComponent("[data-cy='add']");

        await (openCreateButton as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        const ressourceForm = engagementTable.findComponent(RessourceForm);

        // const aavar = engagementTable.html();
        // const baseDialog = engagementTable.findComponent(BaseDialog);
        ressourceForm.vm.$emit('ressource-form-update', mockEngagements[0]);
        const createBtn = engagementTable.findComponent("[data-cy='engagement-create-btn']");
        const engagementInStoreBefore = store.getters.baseTableRows(RessourceName.Engagement).length;
        await (createBtn as unknown as { trigger: (x: string) => Promise<void> }).trigger('click');
        const engagementInStoreAfter = store.getters.baseTableRows(RessourceName.Engagement).length;
        expect(engagementInStoreAfter).toBe(engagementInStoreBefore + 1);
    });
});
