<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'src/store';
import { Row, ParentRessource } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName, DataTest } from 'src/enums/enums';
import { capitalizeFirstLetter } from 'src/utils';
import { RessourceActions } from 'src/ui/BaseTable/ressourceActions';
const store = useStore();
const emit = defineEmits(['all-selected']);

const props = defineProps<{
  ressourceName: RessourceName;
  selected: Row[];
  parentRessource?: ParentRessource;
}>();
const ressourceActions = new RessourceActions(props.ressourceName, store, props.parentRessource);

const menuState = computed({
  get(): boolean {
    return !!store.state.columbo.isHeaderOpenFor[props.ressourceName];
  },
  set(newState: boolean): void {
    store.commit(MutationType.updateRessourceMenu, {
      ressourceName: props.ressourceName,
      isOpen: newState,
    });
  },
});

const isDisabled = (): boolean => {
  return !props.selected.map((r) => r.id).length;
};
const selectAll = ref(false);
</script>

<template>
  <q-checkbox
    v-model="selectAll"
    :data-cy="DataTest.RessourceTableSelectAll"
    @click="emit('all-selected', selectAll)"
  ></q-checkbox>
  <span class="text-h6 q-mr-sm">{{ capitalizeFirstLetter(ressourceName) }}s</span>
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
</template>
