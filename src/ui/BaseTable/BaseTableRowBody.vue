<script setup lang="ts">
/* eslint-disable vue/no-mutating-props */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { DataTest, RessourceName } from 'src/enums/enums';
import DefaultRessourceActions from './DefaultRessourceActions.vue';
import { ParentRessource, TableItem } from 'src/types/types';
const props = defineProps<{
  slotProps: TableItem;
  ressourceName: RessourceName;
  parentRessource?: ParentRessource;
}>();
</script>

<template>
  <q-tr :props="props.slotProps">
    <q-td auto-width>
      <q-checkbox v-model="props.slotProps.selected" :data-cy="DataTest.RessourceTableCardCheckbox" />
      <!-- <span class="q-pa-xs">
              <q-btn
                size="sm"
                round
                dense
                @click="props.slotProps.expand = !props.slotProps.expand"
                :icon="props.slotProps.expand ? 'remove' : 'add'"
              />
            </span> -->
      <!-- <span class="q-pa-xs">
        <q-btn size="sm" round dense icon="mdi-dots-vertical">
          <q-menu>
            <q-item
              :data-cy="DataTest.RessourceTableHeaderCreateNew"
              icon="mdi-plus"
              clickable
              @click="ressourceActions.openCreateDialog()"
            >
              <q-item-section>{{ 'Create new ' + prettyVariable(props.ressourceName) }}</q-item-section>
            </q-item>
            <q-item
              :clickable="!isDisabled()"
              :disable="isDisabled()"
              icon="mdi-delete"
              :data-cy="DataTest.RessourceTableHeaderDeleteAll"
              @click="ressourceActions.deleteRowsInTableAndBackend(props.selected.map((r) => r.id))"
            >
              <q-item-section>{{ 'Delete selected' }}</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>
      </span> -->
    </q-td>
    <q-td v-for="col in props.slotProps.cols" :key="col.name" :props="props.slotProps">
      {{ col.value }}
      <span v-if="col.name === 'Actions'" class="text-left">
        <default-ressource-actions
          :small-icon="false"
          :ressource-name="props.ressourceName"
          :parent-ressource="props.parentRessource"
          :table-item="props.slotProps"
        ></default-ressource-actions>
      </span>
    </q-td>
  </q-tr>
</template>
