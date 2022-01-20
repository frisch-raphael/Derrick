import { describe, expect, it, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import RestClient from 'src/classes/api/restClient';
import { ApiRessource, RessourceName } from 'src/enums/enums';
import { storeKey } from 'src/store';
import store from 'src/store/index';
import { MutationType } from 'src/store/columbo/mutations-types';
import { DataTest } from '../../../../../src/enums/enums';
jest.mock('src/classes/api/restClient');
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
      ressourceName: 'engagement',
      restClient: restClient
    }
  } as any);

describe('a BaseTable', () => {
  beforeEach(() => {
    store.commit(MutationType.updateRessourceTable, { ressourceName: RessourceName.Engagement, rows: rows });
    // Clear all instances and calls to constructor and all methods:
    mockedRestClient.mockClear();

  });


  it('can mount', () => {
    expect(wrapper).not.toBeNull();
  });

  it('has default actions on its cards', () => {
    const saveButton = wrapper.findComponent("[data-cy='" + DataTest.RessourceTableCardUpdateBtn + "']");
    expect(saveButton.exists()).toBe(true);
    const removeButton = wrapper.findComponent("[data-cy='" + DataTest.RessourceTableCardDeleteBtn + "']");
    expect(removeButton.exists()).toBe(true);
  });




  it('has functional remove button', async () => {
    const rowNumber = rows.length;
    const removeButton = wrapper.find("[data-cy='" + DataTest.RessourceTableCardDeleteBtn + "']");
    await removeButton.trigger('click');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(store.getters.RessourceTableRows(RessourceName.Engagement).length).toBe(rowNumber - 1);
  });

});
