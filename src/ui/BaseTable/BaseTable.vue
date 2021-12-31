<script lang="ts" setup>
import { Table } from 'src/ui/BaseTable/Table';
import { ref, reactive } from 'vue';
import SearchInput from 'src/ui/SearchInput.vue';
import BaseTableCard from './BaseTableCard/BaseTableCard.vue';
import BaseTableHeaderMenu from 'src/ui/BaseTable/BaseTableHeaderMenu/BaseTableHeaderMenu.vue';
import { IRestClient } from 'src/classes/api/engagement';
import { Columns, Row, CardAction, HeaderAction } from 'src/types/types';
import { RessourceName } from 'src/enums/enums';

interface Props {
  restClient: IRestClient;
  ressourceName: RessourceName;
  grid: boolean;
  columns: Columns<any>;
  pRows: Row[];
  cardActions: CardAction[];
  headerActions: HeaderAction[];
  pIsMenuOpen: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  cardActions: () => [],
  headerActions: () => [],
  grid: true,
  pIsMenuheaderOpen: false,
});

const emit = defineEmits(['add', 'delete', 'update', 'showMenu', 'hideMenu']);
const state = reactive({ rows: props.pRows });
const table = new Table(state, props, emit);
const { defaultCardActions, defaultHeaderActions } = table.getDefaultActions();

const filter = ref(''); //TODO link to SearchInput
const selected = ref([]);
const allCardActions = props.cardActions.concat(defaultCardActions);
const allHeaderActions = props.headerActions.concat(defaultHeaderActions);

</script>

<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      :rows="state.rows"
      :columns="columns"
      row-key="id"
      selection="multiple"
      :filter="filter"
      :grid="grid"
      hide-header
      hide-bottom
    >
      <template #top-right>
        <search-input></search-input>
      </template>

      <template #top-left>
        <base-table-header-menu
          :ressource-name="ressourceName"
          :actions="allHeaderActions"
        ></base-table-header-menu>
      </template>

      <template v-if="grid" #item="props">
        <base-table-card
          :actions="allCardActions"
          :table-item="props"
        ></base-table-card>
      </template>
    </q-table>

    <q-markup-table v-if="state.rows && !state.rows.length" data-test="no-data">
      <q-banner>
        <template #avatar>
          <q-icon name="mdi-emoticon-sad-outline" />
        </template>
        No {{ ressourceName }} found ! Create one from the menu.
      </q-banner>
    </q-markup-table>
  </div>
</template>
