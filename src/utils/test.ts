import RestClient from 'src/classes/api/restClient';

export const createRestClientWithMockedIndex = (fakeResponse: Record<string, any>[] | Record<string, any>) => {
    const mockResponse = Promise.resolve(fakeResponse);
    jest.mock('src/classes/api/restClient');
    const mockedRestClient = <jest.Mock<RestClient>>RestClient;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    mockedRestClient.prototype.index = jest.fn().mockReturnValue(mockResponse);
    return mockedRestClient;
};