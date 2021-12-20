/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, flushPromises } from '@vue/test-utils';
// import { QBtn } from 'quasar';
import EngagementTable from 'src/pages/EngagementTable'
import { makeFakeEngagement } from 'src/factories/engagement';
import { IEngagement } from 'src/dtos/engagement';
import { Endpoints } from 'src/enums/enums';
import request from 'src/axios';
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


// const mockedGetEngagement = jest.fn().mockReturnValue(mockEngagements);
// (axios.get as any) = mockedGetEngagement;

// EngagementRest.index = mockStaticF

describe('the engagement table', () => {
    // eslint-disable-next-line jest/expect-expect
    it('load engagements on mount', async () => {
        const wrapper = mount(EngagementTable);
        // expect(EngagementRest.index).toHaveBeenLastCalledWith('/engagements');
        // Wait until the DOM updates.
        await flushPromises();
        var dsfdsf = wrapper.html();
        // Finally, we make sure we've rendered the content from the API.
        const engagements = wrapper.findAll('[data-test="engagement"]');
        // const test = await request({ method: 'get', url: Endpoints.Engagements });
        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({ method: 'get', url: Endpoints.Engagements });
        expect(engagements).toHaveLength(10);
    });

});
