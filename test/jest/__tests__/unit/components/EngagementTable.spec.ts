/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { describe, expect, it, jest } from '@jest/globals';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, shallowMount, flushPromises } from '@vue/test-utils';
import axios from 'axios';
// import { QBtn } from 'quasar';
import EngagementTable from 'src/pages/EngagementTable'
import { makeFakeEngagement } from 'src/factories/engagement';
import { IEngagement } from 'src/dtos/engagement';
import { useAxios, UseAxiosReturn } from '@vueuse/integrations';
import EngagementRest from 'src/classes/api/engagement';
// // Specify here Quasar config you'll need to test your component
installQuasarPlugin();

let engagementNumber = 10
const mockEngagements: IEngagement[] = []
while (engagementNumber--) mockEngagements[engagementNumber] = makeFakeEngagement();

const mockReturn: UseAxiosReturn<IEngagement[]> = {
    response: ref(undefined),
    data: ref(mockEngagements),
    isFinished: ref(true),
    isLoading: ref(false),
    aborted: ref(false),
    error: ref(undefined),
    abort: () => { undefined }

}

jest.mock('src/classes/api/engagement')
const mockedGetEngagement = jest.fn().mockReturnValue(mockReturn)

// EngagementRest.index = mockStaticF

describe('the engagement table', () => {
    // eslint-disable-next-line jest/expect-expect
    it('load engagements on mount', async () => {

        const wrapper = mount(EngagementTable);
        (EngagementRest.index as any) = mockedGetEngagement;
        const test = EngagementRest.index();
        // expect(EngagementRest.index).toHaveBeenLastCalledWith('/engagements');
        // Wait until the DOM updates.
        await flushPromises()

        // Finally, we make sure we've rendered the content from the API.
        const posts = wrapper.findAll('[data-test="engagement"]')

        expect(posts).toHaveLength(engagementNumber)
    });

});
