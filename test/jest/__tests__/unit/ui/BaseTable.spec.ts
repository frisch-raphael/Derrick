import { describe, expect, it, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import RestClient from 'src/classes/api/engagement';
import { ApiRessource } from '../../../../../src/enums/enums';
import { storeKey } from 'src/store';
import store from 'src/store/index';
jest.mock('src/classes/api/engagement');
const mockedRestClient = <jest.Mock<RestClient>>RestClient;
// const mockedRestClient = mocked(RestClient, true)
// Specify here Quasar config you'll need to test your component
installQuasarPlugin();

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat' }
];

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    id: 1
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    id: 2
  }
];

const restClient = new mockedRestClient(ApiRessource.Engagement);

const wrapper = mount(BaseTable,
  {
    global: {
      provide: { [(storeKey as any)]: store }
    },
    props: {
      columns: columns,
      pRows: rows,
      ressourceName: 'engagement',
      restClient: restClient
    }
  } as any);;

describe('a BaseTable', () => {
  beforeEach(() => {

    // Clear all instances and calls to constructor and all methods:
    mockedRestClient.mockClear();

  });


  it('can mount', () => {
    expect(wrapper).not.toBeNull();
  });

  it('has default actions on its cards', () => {
    const saveButton = wrapper.findComponent("[data-test='save']");
    expect(saveButton.exists()).toBe(true);
    const removeButton = wrapper.findComponent("[data-test='remove']");
    expect(removeButton.exists()).toBe(true);
  });


  it('displays message when no engagement found', async () => {
    const wrapper = mount(BaseTable,
      {
        global: {
          provide: { [(storeKey as any)]: store }
        },
        props: {
          columns: [],
          pRows: [],
          ressourceName: 'engagement',
          restClient: restClient
        }
      });
    await flushPromises();
    const removeButton = wrapper.findComponent("[data-test='no-data']");
    expect(removeButton.exists()).toBe(true);
  });

  it('has functional remove button', async () => {


    const rowNumber = rows.length;
    const removeButton = wrapper.find("[data-test='remove']");
    await removeButton.trigger('click');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(restClient.delete).toHaveBeenCalled();
    expect((wrapper.vm as unknown as { state: { rows: [] } }).state.rows.length).toBe(rowNumber - 1);
  });

});
