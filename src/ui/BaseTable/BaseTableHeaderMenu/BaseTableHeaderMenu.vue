<script setup lang="ts">
import { computed, ref } from 'vue';
import { Row, ParentRessource } from 'src/types/types';
import { RessourceName, DataTest } from 'src/enums/enums';
import { capitalizeFirstLetter } from 'src/utils/utils';
import { RessourceActions } from 'src/ui/BaseTable/ressourceActions';
import { useUiStore } from 'src/stores/ui';
const store = useUiStore();
const emit = defineEmits(['all-selected']);

const props = defineProps<{
  ressourceName: RessourceName;
  selected: Row[];
  parentRessource?: ParentRessource;
  title: string;
}>();
const ressourceActions = new RessourceActions(props.ressourceName, props.parentRessource);

const menuState = computed({
  get(): boolean {
    return !!store.isHeaderOpenFor[props.ressourceName];
  },
  set(newState: boolean): void {
    store.updateRessourceMenu(props.ressourceName, newState);
  },
});

const isDisabled = (): boolean => {
  return !props.selected.map((r) => r.id).length;
};
const selectAll = ref(false);
</script>

<template>
  <div>
    <q-checkbox
      v-model="selectAll"
      :data-cy="DataTest.RessourceTableSelectAll"
      @click="emit('all-selected', selectAll)"
    ></q-checkbox>
    <span :data-cy="DataTest.RessourceTableHeaderTitle" class="text-h6 q-mr-sm">
      {{ title || `${capitalizeFirstLetter(ressourceName)}s` }}
    </span>
    <q-btn
      size="sm"
      class="q-mb-xs"
      round
      icon="mdi-dots-vertical"
      :data-cy="DataTest.RessourceTableOpenHeaderMenuBtn"
    >
      <q-menu v-model="menuState">
        <q-list>
          <q-item
            :data-cy="DataTest.RessourceTableHeaderCreateNew"
            icon="mdi-plus"
            clickable
            @click="ressourceActions.openCreateDialog()"
          >
            <q-item-section>{{ 'Create new ' + props.ressourceName }}</q-item-section>
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
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
