import { setActivePinia, createPinia } from 'pinia';
import { describe, expect, it } from '@jest/globals';
import { useConfigStore } from 'src/stores/config';
import RestClient from 'src/classes/api/restClient';
import { makeFakeConfig } from 'src/factories/mock/config';
import ISO6391 from 'iso-639-1';
const fakeConfig = makeFakeConfig();
const mockResponse = Promise.resolve(fakeConfig);

jest.mock('src/classes/api/restClient');
const mockedRestClient = <jest.Mock<RestClient>>RestClient;
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
mockedRestClient.prototype.index = jest.fn().mockReturnValue(mockResponse);
setActivePinia(createPinia());
const store = useConfigStore();

describe('actions', () => {

    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        mockedRestClient.mockClear();

    });

    it('update create/edit ressource form state', async () => {
        await store.fetchConfigTranslationEntries();
        expect(mockedRestClient).toHaveBeenCalled();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(mockedRestClient.prototype.index).toHaveBeenCalled();
        expect(store.supportedLanguages).toEqual(fakeConfig.languages.map(code => ISO6391.getName(code)));
        expect(store.assessmentTypesTranslations).toEqual(fakeConfig.assessment_types);
        expect(store.findingTypesTranslations).toEqual(fakeConfig.finding_types);
    });


});