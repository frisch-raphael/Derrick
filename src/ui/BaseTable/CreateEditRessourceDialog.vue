<script lang="ts" setup>
import { ref, Ref, computed } from 'vue';
import { RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';
import { MutationType } from 'src/store/columbo/mutations-types';
import RestClient from 'src/classes/api/restClient';
import { ressourceNameToForm } from 'src/utils';
import BaseDialog from 'src/ui/BaseDialog.vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { AxiosError } from 'axios';
import { CreateEditDialogState } from 'src/store/columbo/state';
import { GenericRessource } from 'src/types/types';
import { Notify } from 'quasar';

const store = useStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();
const emits = defineEmits(['loading-changed']);

const defaultState: CreateEditDialogState = { mode: 'create', isOpen: false, ressourceToEdit: { id: 0 } };
const state = computed(
  () => store.state.columbo.createEditRessourceStatus[props.ressourceName] || defaultState
);
let createEditDialogState = computed({
  get(): boolean {
    return !!store.state.columbo.createEditRessourceStatus[props.ressourceName]?.isOpen;
  },
  set(newState: boolean): void {
    store.commit(MutationType.updateCreateEditRessourceState, {
      ressource: props.ressourceName,
      isOpen: newState,
      mode: state.value.mode,
      ressourceToEdit: state.value.ressourceToEdit,
    });
  },
});
const newCreateEditRessource: Ref<Partial<GenericRessource>> = ref({ title: '' });

const updateRessourceToCreate = (ressource: GenericRessource) =>
  (newCreateEditRessource.value = { ...ressource });

const reinit = () => {
  store.commit(MutationType.updateRessourceMenu, {
    ressource: props.ressourceName,
    isOpen: false,
  });
  createEditDialogState.value = false;
  newCreateEditRessource.value = { title: '' };
};

const title = computed(() =>
  state.value.mode === 'create' ? `create new ${props.ressourceName}` : `edit ${props.ressourceName}`
);

const createEditRessource = async () => {
  const mode = store.getters.createEditRessourceStatus(props.ressourceName).mode;

  const client = new RestClient(props.ressourceName);
  createEditDialogState.value = false;
  let ressourceFromBackend: GenericRessource;
  if (mode === 'create') {
    emits('loading-changed');
    ressourceFromBackend = await client.create<GenericRessource>(newCreateEditRessource.value);
    emits('loading-changed');
  } else {
    ressourceFromBackend = await client.update<GenericRessource>(
      state.value.ressourceToEdit.id,
      newCreateEditRessource.value
    );
  }
  reinit();

  store.commit(MutationType.createEditOneRessourceTableRow, {
    ressource: props.ressourceName,
    row: ressourceFromBackend,
  });
};

const tryToCreateEditRessource = async () => {
  try {
    await createEditRessource();
  } catch (err) {
    const error = err as AxiosError;
    Notify.create({
      message: `could not ${state.value.mode} ${props.ressourceName}: ${error.message}`,
      type: 'negative',
    });
  }
};
</script>

<template>
  <base-dialog v-model="createEditDialogState" :title="title" @before-hide="reinit()">
    <ressource-form
      :ressource="state.mode === 'edit' ? state.ressourceToEdit : undefined"
      :ressource-form-config="ressourceNameToForm[props.ressourceName]"
      @submit="tryToCreateEditRessource"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
  </base-dialog>
</template>
