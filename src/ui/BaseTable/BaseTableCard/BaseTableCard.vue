<script lang="ts" setup>
/* eslint-disable vue/no-mutating-props */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { TableItem, CardAction as CardAction } from 'src/types/types';
import { LooseDictionary } from 'src/types/types';
import { DataTest } from 'src/enums/enums';

interface Props {
  tableItem: TableItem;
  actions: CardAction[];
}
withDefaults(defineProps<Props>(), {
  actions: () => [],
});

const launchAction = (action: CardAction, row: Record<string, any>) => {
  action.isRessourcePayloadNeed || action.function(row.id);
  action.isRessourcePayloadNeed && action.function(row.id, row);
};
const getFilteredcols = (cols: LooseDictionary) =>
  cols.filter(
    (col: { name: string; label: string; value: any }) => col.name !== 'desc'
  );
</script>

<template>
  <div
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
    :style="tableItem?.selected ? 'transform: scale(0.95);' : ''"
  >
    <q-card
      :class="tableItem?.selected ? 'bg-grey-2' : ''"
      :data-cy="DataTest.RessourceTableCard"
    >
      <q-card-section>
        <q-checkbox
          v-model="tableItem.selected"
          :data-cy="DataTest.RessourceTableCardCheckbox"
          dense
          :label="tableItem?.row.name"
        />
        <q-space></q-space>
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
        <q-btn
          v-for="action in actions"
          :key="action.icon"
          rounded
          size="sm"
          :data-cy="'table-card-action-' + action.name"
          :color="action.color"
          :icon="action.icon"
          @click="launchAction(action, tableItem.row)"
        >
          <q-tooltip>{{ action.tooltip }}</q-tooltip>
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>
