<script lang="ts" setup>
import { Table } from 'src/ui/BaseTable/TableClass';
import { ref, Ref } from 'vue';
import SearchInput from 'src/ui/SearchInput.vue';
import BaseTableCard from './BaseTableCard/BaseTableCard.vue';
import BaseTableHeaderMenu from 'src/ui/BaseTable/BaseTableHeaderMenu/BaseTableHeaderMenu.vue';
import { IRestClient } from 'src/classes/api/engagement';
import { Columns, CardAction, HeaderAction, Row } from 'src/types/types';
import { RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';

const store = useStore();

interface Props {
  restClient: IRestClient;
  ressourceName: RessourceName;
  grid: boolean;
  columns: Columns<any>;
  cardActions: CardAction[];
  headerActions: HeaderAction[];
}

const props = withDefaults(defineProps<Props>(), {
  cardActions: () => [],
  headerActions: () => [],
  grid: true,
});

const emit = defineEmits(['add']);

const table = new Table(props, emit, store);
const { defaultCardActions, defaultHeaderActions } = table.getDefaultActions();

const filter = ref(''); //TODO link to SearchInput
const selected: Ref<Row[]> = ref([]);
const allCardActions = props.cardActions.concat(defaultCardActions);
const allHeaderActions = props.headerActions.concat(defaultHeaderActions);

const allSelectedAllClicked = (checked: boolean) => {
  selected.value = checked
    ? store.getters.baseTableRows(RessourceName.Engagement)
    : [];
};
</script>

<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      :rows="store.getters.baseTableRows(ressourceName)"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :pagination="{ rowsNumber: 0 }"
      :filter="filter"
      :grid="grid"
      hide-bottom
    >
      <template #top-right>
        <search-input></search-input>
      </template>

      <template #top-left>
        <base-table-header-menu
          :ressource-name="ressourceName"
          :actions="allHeaderActions"
          @all-selected="allSelectedAllClicked"
        ></base-table-header-menu>
      </template>

      <template v-if="grid" #item="slotProps">
        <base-table-card
          :actions="allCardActions"
          :table-item="slotProps"
        ></base-table-card>
      </template>
    </q-table>

    <q-markup-table
      v-if="!store.getters.baseTableRows(ressourceName).length"
      data-cy="no-data"
    >
      <q-banner>
        <template #avatar>
          <q-icon name="mdi-emoticon-sad-outline" />
        </template>
        No {{ ressourceName }} found ! Create one from the menu.
      </q-banner>
    </q-markup-table>
  </div>
</template>
