<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'src/store';
import { HeaderAction, Row } from 'src/types/types';
import { MutationType } from 'src/store/columbo/mutations-types';
import { RessourceName, DataTest } from 'src/enums/enums';
import { capitalizeFirstLetter } from 'src/utils';
const store = useStore();
const emit = defineEmits(['all-selected']);

const props = defineProps<{
  ressourceName: RessourceName;
  actions: HeaderAction[];
  selected: Row[];
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
  if (headerAction.params === 'none') headerAction.function();
  else if (headerAction.params === 'ids') headerAction.function(props.selected.map((r) => r.id));
};
const isDisabled = (headerAction: HeaderAction): boolean => {
  if (headerAction.params === 'ids') return !props.selected.map((r) => r.id).length;
  else return false;
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
          v-for="action in actions"
          :key="action.name"
          :clickable="!isDisabled(action)"
          :disable="isDisabled(action)"
          :data-cy="action.datatest"
          @click="launchAction(action)"
        >
          <q-item-section>{{ action.name }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
