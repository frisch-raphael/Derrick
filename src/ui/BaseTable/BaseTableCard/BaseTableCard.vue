<script lang="ts" src="./BaseTableCard.ts"></script>

<template>
  <div
    data-test="table-item"
    class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
    :style="tableItem.selected ? 'transform: scale(0.95);' : ''"
  >
    <q-card :class="tableItem.selected ? 'bg-grey-2' : ''">
      <q-card-section>
        <q-checkbox
          v-model="tableItem.selected"
          dense
          :label="tableItem.row.name"
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
          :data-test="action.name"
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
