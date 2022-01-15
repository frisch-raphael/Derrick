<script lang="ts" setup>
import { ref, Ref } from 'vue';
import SearchInput from 'src/ui/SearchInput.vue';
import BaseTableCard from './BaseTableCard/BaseTableCard.vue';
import BaseTableHeaderMenu from 'src/ui/BaseTable/BaseTableHeaderMenu/BaseTableHeaderMenu.vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { RessourceActions } from 'src/ui/BaseTable/ressourceActions';
import { Columns, HeaderAction, Row, TableItem } from 'src/types/types';
import { RessourceName, DataTest } from 'src/enums/enums';
import { useStore } from 'src/store';
import { LooseDictionary } from '../../types/types';

const store = useStore();

interface Props {
  ressourceName: RessourceName;
  grid: boolean;
  columns: Columns<any>;
  headerActions?: HeaderAction[];
}

const props = withDefaults(defineProps<Props>(), {
  headerActions: () => [],
  grid: true,
});

const ressourceActions = new RessourceActions(props.ressourceName, store);
const { defaultHeaderActions } = ressourceActions.getDefaultActions();
const isLoading = ref(false);

const filter = ref(''); //TODO link to SearchInput
const selected: Ref<Row[]> = ref([]);
const allHeaderActions = props.headerActions.concat(defaultHeaderActions);

const updateFilter = (new_filter: string) => {
  filter.value = new_filter;
};

const selectAllClicked = (checked: boolean) => {
  selected.value = checked ? store.getters.RessourceTableRows(RessourceName.Engagement) : [];
};

const typeSlotProps = (slotProps: LooseDictionary) => {
  return slotProps as TableItem;
};
</script>

<template>
  <div class="q-pa-md">
    <q-linear-progress
      :data-cy="DataTest.RessourceTableLoading"
      color="primary"
      :indeterminate="isLoading"
    ></q-linear-progress>
    <q-table
      v-model:selected="selected"
      :rows="store.getters.RessourceTableRows(ressourceName)"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :pagination="{ rowsPerPage: 0 }"
      :filter="filter"
      :grid="grid"
      hide-bottom
    >
      <template #top-right>
        <search-input @update:modelValue="updateFilter"></search-input>
      </template>

      <template #top-left>
        <base-table-header-menu
          :selected="selected"
          :ressource-name="ressourceName"
          :actions="allHeaderActions"
          @all-selected="selectAllClicked"
        ></base-table-header-menu>
      </template>

      <template v-if="grid" #item="slotProps">
        <base-table-card :ressource-name="ressourceName" :table-item="typeSlotProps(slotProps)">
          <template #bottom-actions="{ row }">
            <slot name="card-bottom-actions" :row="row"></slot>
          </template>
        </base-table-card>
      </template>
    </q-table>

    <q-markup-table
      v-if="store.getters.RessourceTableRows(ressourceName).length === 0"
      :data-cy="DataTest.RessourceFormNoData"
    >
      <q-banner>
        <template #avatar>
          <q-icon color="primary" name="mdi-emoticon-sad-outline" />
        </template>
        No {{ ressourceName }} found ! Create one from the menu.
      </q-banner>
    </q-markup-table>

    <create-edit-ressource-dialog
      :ressource-name="props.ressourceName"
      @loading-changed="isLoading = !isLoading"
    ></create-edit-ressource-dialog>
  </div>
</template>
