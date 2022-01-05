<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'src/store';
import { HeaderAction } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName, DataTest } from 'src/enums/enums';
const store = useStore();
const emit = defineEmits(['all-selected']);

const props = defineProps<{
  ressourceName: RessourceName;
  actions: HeaderAction[];
}>();

const menuState = computed({
  get(): boolean {
    return !!store.state.columbo.isHeaderOpenFor?.engagement;
  },
  set(newState: boolean): void {
    store.commit(MutationType.updateRessourceMenu, {
      ressource: props.ressourceName,
      isOpen: newState,
    });
  },
});

const launchAction = (headerAction: HeaderAction) => {
  headerAction.isRowsNeeded || headerAction.function();
};
const selectAll = ref(false);
</script>

<template>
  <q-checkbox
    v-model="selectAll"
    :data-cy="DataTest.RessourceTableSelectAll"
    @click="emit('all-selected', selectAll)"
  ></q-checkbox>
  <span class="text-h6 q-mr-sm">{{ ressourceName }}s</span>
  <q-btn
    size="sm"
    class="q-mb-xs"
    round
    icon="mdi-dots-vertical"
    :data-cy="DataTest.RessourceTableOpenHeaderMenuBtn"
  >
    <q-menu v-model="menuState">
      <q-list>
        <q-item v-for="action in actions" :key="action.name" clickable>
          <q-item-section
            :data-cy="action.datatest"
            @click="launchAction(action)"
            >{{ action.name }}</q-item-section
          >
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
