import { describe, expect, it, jest } from '@jest/globals';
import { mocked } from 'ts-jest/utils';
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest';
import { mount } from '@vue/test-utils';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import RestClient from 'src/classes/api/restClient';
import { ApiRessource, RessourceName } from 'src/enums/enums';
import { DataTest } from 'src/enums/enums';
import { createTestingPinia } from '@pinia/testing';
import { useUiStore } from 'src/stores/ui';
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
      plugins: [createTestingPinia({ stubActions: false })]
    },
    props: {
      columns: columns,
      ressourceName: 'engagement',
      restClient: restClient
    }
  } as any);

describe('a BaseTable', () => {

  beforeEach(() => {
    const store = useUiStore();
    store.updateRessourceTable(RessourceName.Engagement, rows);
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
    const store = useUiStore();

    const rowNumber = rows.length;
    const removeButton = wrapper.find("[data-cy='" + DataTest.RessourceTableCardDeleteBtn + "']");
    await removeButton.trigger('click');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(store.ressourceTableRows?.engagement?.length).toBe(rowNumber - 1);
  });

});
