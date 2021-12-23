import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, flushPromises } from '@vue/test-utils';
import EngagementTable from 'src/pages/EngagementTable'
import { makeFakeEngagement } from 'src/factories/engagement';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import { Endpoints } from 'src/enums/enums';
import { QCard } from 'quasar';
// // Specify here Quasar config you'll need to test your component
installQuasarPlugin();

let engagementNumber = 10
const mockEngagements: IEngagement[] = []
while (engagementNumber--) mockEngagements[engagementNumber] = makeFakeEngagement();
const mockResponse = Promise.resolve({ data: mockEngagements })

jest.mock('src/axios', () => ({
    __esModule: true, // this property makes it work
    default: jest.fn(() => mockResponse),
}));

describe('the engagement table', () => {
    it('load engagements on mount', async () => {
        const wrapper = mount(EngagementTable);
        await flushPromises();
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({ method: 'get', url: Endpoints.Engagements });
        expect(wrapper.vm.engagementsRows).toHaveLength(10);
        const engagements = wrapper.findAll('[data-test="table-item"]');
        expect(engagements).toHaveLength(10);
    });

});
