<script lang="ts" setup>
import { ref, Ref } from 'vue';
import SearchInput from 'src/ui/SearchInput.vue';
import BaseTableCard from './BaseTableCard/BaseTableCard.vue';
import BaseTableRowBody from './BaseTableRowBody.vue';
import BaseTableHeaderMenu from 'src/ui/BaseTable/BaseTableHeaderMenu/BaseTableHeaderMenu.vue';
import CreateEditRessourceDialog from 'src/ui/BaseTable/CreateEditRessourceDialog.vue';
import { Columns, ParentRessource, Row, TableItem } from 'src/types/types';
import { RessourceName, DataTest } from 'src/enums/enums';
import { LooseDictionary } from 'src/types/types';
import { useUiStore } from 'src/stores/ui';
import { prettyVariable } from 'src/utils/utils';

const store = useUiStore();

interface Props {
  ressourceName: RessourceName;
  parentRessource?: ParentRessource;
  grid: boolean;
  title?: string;
  columns: Columns<any>;
}

const props = withDefaults(defineProps<Props>(), {
  headerActions: () => [],
  grid: true,
  title: '',
  parentRessource: undefined,
});

const isLoading = ref(false);
const filter = ref(''); //TODO link to SearchInput
const selected: Ref<Row[]> = ref([]);

const updateFilter = (new_filter: string) => {
  filter.value = new_filter;
};

const selectAllClicked = (checked: boolean) => {
  selected.value = checked ? store.ressourceTableRows[props.ressourceName] ?? [] : [];
};

const typeSlotProps = (slotProps: LooseDictionary) => slotProps as TableItem;

const columns = props.grid
  ? props.columns
  : props.columns?.concat({ name: 'Actions', field: 'Actions', label: 'Actions' });
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
      :rows="store.ressourceTableRows[props.ressourceName]"
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
          :title="props.title"
          :selected="selected"
          :data-cy="DataTest.RessourceTableHeader"
          :parent-ressource="parentRessource"
          :ressource-name="ressourceName"
          :grid="props.grid"
          @all-selected="selectAllClicked"
        ></base-table-header-menu>
      </template>

      <template v-if="grid" #item="slotProps">
        <base-table-card
          :ressource-name="ressourceName"
          :parent-ressource="parentRessource"
          :table-item="typeSlotProps(slotProps)"
        >
          <template #bottom-actions="{ row }">
            <slot name="card-bottom-actions" :row="row"></slot>
          </template>
        </base-table-card>
      </template>
      <template v-if="!grid" #body="slotProps">
        <base-table-row-body
          :parent-ressource="props.parentRessource"
          :ressource-name="props.ressourceName"
          :slot-props="slotProps"
        ></base-table-row-body>
      </template>
    </q-table>

    <q-markup-table
      v-if="store.ressourceTableRows[props.ressourceName]?.length === 0"
      :data-cy="DataTest.RessourceFormNoData"
    >
      <q-banner>
        <template #avatar>
          <q-icon color="primary" name="mdi-cat" />
        </template>
        No {{ prettyVariable(ressourceName) }} found ! Create one from the menu.
      </q-banner>
    </q-markup-table>

    <create-edit-ressource-dialog
      :ressource-name="props.ressourceName"
      @loading-changed="isLoading = !isLoading"
    ></create-edit-ressource-dialog>
  </div>
</template>

<style lang="sass">
.q-checkbox__inner--truthy
  color: var(--q-primary) !important
.q-checkbox__inner--indet
  color: var(--q-primary) !important
.q-table .q-checkbox
  padding-left: 0px
.q-table th
  text-align: left
.q-table th:last-child
  text-align: right
</style>
