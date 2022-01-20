<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TableItem, ParentRessource } from 'src/types/types';
import { LooseDictionary } from 'src/types/types';
import { DataTest, RessourceName } from 'src/enums/enums';
import { RessourceActions } from 'src/ui/BaseTable/ressourceActions';
import { capitalizeFirstLetter } from 'src/utils';
import { useStore } from 'src/stores';
const store = useStore();
interface Props {
  tableItem: TableItem;
  ressourceName: RessourceName;
  parentRessource?: ParentRessource;
}
const props = withDefaults(defineProps<Props>(), {
  parentRessource: undefined,
});

const ressourceActions = new RessourceActions(props.ressourceName, props.parentRessource);

const getFilteredcols = (cols: LooseDictionary) =>
  cols.filter((col: { name: string; label: string; value: any }) => col.name !== 'title');
const isLoading = (id: number) => store.ressourceTableLoading[props.ressourceName]?.includes(id);
</script>

<template>
  <div
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
    :style="tableItem?.selected ? 'transform: scale(0.95);' : ''"
  >
    <q-card :class="tableItem?.selected ? 'bg-primary' : 'bg-dark-2'" :data-cy="DataTest.RessourceTableCard">
      <q-linear-progress
        :data-cy="DataTest.RessourceTableCardLoading"
        :indeterminate="isLoading(tableItem.row.id)"
      ></q-linear-progress>
      <q-card-section class="q-pa-none">
        <div class="row">
          <q-checkbox
            v-model="tableItem.selected"
            class="q-pa-md"
            :data-cy="DataTest.RessourceTableCardCheckbox"
            dense
            :label="tableItem?.row.title"
          />
          <q-space></q-space>
          <q-btn
            :data-cy="DataTest.RessourceTableCardUpdateBtn"
            icon="mdi-open-in-new"
            color="secondary"
            flat
            class="self-start q-pt-sm q-pa-xs"
            size="sm"
            @click="ressourceActions.openEditDialog(tableItem?.row)"
          >
            <q-tooltip>Edit {{ capitalizeFirstLetter(props.ressourceName) }}</q-tooltip>
          </q-btn>
          <q-btn
            :data-cy="DataTest.RessourceTableCardDeleteBtn"
            icon="mdi-close-circle"
            color="red-10"
            flat
            class="self-start q-pt-sm q-pr-sm q-pa-xs"
            size="sm"
            @click="ressourceActions.deleteRowsInTableAndBackend([tableItem?.row.id])"
          >
            <q-tooltip>Delete {{ capitalizeFirstLetter(props.ressourceName) }}</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-separator />
      <q-list dense>
        <q-item v-for="col in getFilteredcols(tableItem.cols)" :key="col.name">
          <q-item-section>
            <q-item-label>{{ col.label }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ col.value }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-card-actions>
        <slot name="bottom-actions" :row="tableItem?.row"> </slot>
      </q-card-actions>
    </q-card>
  </div>
</template>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>
