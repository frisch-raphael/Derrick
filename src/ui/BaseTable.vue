<script lang="ts" src="./BaseTable.ts"></script>

<template>
  <div class="q-pa-md">
    <q-table
      v-model:selected="selected"
      :rows="rows"
      :columns="columns"
      row-key="name"
      selection="multiple"
      :filter="filter"
      grid
      hide-header
      hide-bottom
      :loading="loading"
    >
      <template #top-right>
        <q-input
          v-model="filter"
          borderless
          dense
          debounce="300"
          placeholder="Search"
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template #top-left>
        <span class="text-h6 q-mr-sm">{{ title }}</span>
        <q-btn size="sm" round icon="mdi-dots-vertical"></q-btn>
      </template>

      <template #item="props">
        <div
          data-test="table-item"
          class="
            q-pa-xs
            col-xs-12 col-sm-6 col-md-4 col-lg-3
            grid-style-transition
          "
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section>
              <q-checkbox
                v-model="props.selected"
                dense
                :label="props.row.name"
              />
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item
                v-for="col in props.cols.filter((col) => col.name !== 'desc')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
            <slot name="card-buttons"> </slot>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">
.grid-style-transition
  transition: transform .28s, background-color .28s
</style>
