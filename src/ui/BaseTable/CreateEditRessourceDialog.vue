<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';
import { MutationType } from 'src/store/columbo/mutations-types';
import RestClient from 'src/classes/api/restClient';
import { capitalizeFirstLetter, ressourceNameToForm } from 'src/utils';
import BaseDialog from 'src/ui/BaseDialog.vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { CreateEditDialogState } from 'src/store/columbo/state';
import { GenericRessource } from 'src/types/types';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';

const store = useStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();
const emits = defineEmits(['loading-changed']);

const defaultState: CreateEditDialogState = { mode: 'create', isOpen: false };
const storeState = computed(
  () => store.state.columbo.createEditRessourceStatus[props.ressourceName] || defaultState
);
let createEditDialogState = computed({
  get(): boolean {
    return !!store.state.columbo.createEditRessourceStatus[props.ressourceName]?.isOpen;
  },
  set(newState: boolean): void {
    store.commit(MutationType.updateCreateEditRessourceState, {
      ressourceName: props.ressourceName,
      isOpen: newState,
      mode: storeState.value.mode,
      ressourceToEdit: storeState.value.ressourceToEdit,
      parentRessource: storeState.value.parentRessource,
      isParentStoreTarget: storeState.value.isParentStoreTarget,
    });
  },
});
const localState = reactive({ newCreateEditRessource: {} });

const updateRessourceToCreate = (ressource: GenericRessource) =>
  (localState.newCreateEditRessource = { ...ressource });

const closeRessourceTableHeader = () => {
  store.commit(MutationType.updateRessourceMenu, {
    ressourceName: props.ressourceName,
    isOpen: false,
  });
};
const reinit = () => {
  closeRessourceTableHeader();
  createEditDialogState.value = false;
  localState.newCreateEditRessource = {};
  store.commit(MutationType.updateCreateEditRessourceState, {
    ressourceName: props.ressourceName,
    ressourceToEdit: undefined,
    parentRessource: undefined,
    mode: undefined,
  });
};

const title = computed(() => {
  if (storeState.value.parentRessource?.ressource) return `${capitalizeFirstLetter(props.ressourceName)}`;
  return storeState.value.mode === 'create'
    ? `create new ${props.ressourceName}`
    : `edit ${props.ressourceName}`;
});

const createEditRessource = async () => {
  const mode = store.getters.createEditRessourceStatus(props.ressourceName).mode;
  let client: RestClient;
  client = storeState.value.parentRessource
    ? new RestClient(props.ressourceName, storeState.value.parentRessource)
    : new RestClient(props.ressourceName);
  createEditDialogState.value = false;
  let ressourceFromBackend: GenericRessource;
  if (mode === 'create') {
    emits('loading-changed');
    try {
      ressourceFromBackend = await client.create<GenericRessource>(localState.newCreateEditRessource);
    } catch (error) {
      const err = error as AxiosError;
      Notify.create({ message: err.message, type: 'negative' });
      return;
    } finally {
      emits('loading-changed');
    }
  } else {
    if (!storeState.value.ressourceToEdit) throw Error('Editing ressource but none found');
    ressourceFromBackend = await client.update<GenericRessource>(
      storeState.value.ressourceToEdit.id,
      localState.newCreateEditRessource
    );
  }
  let newRow: GenericRessource;
  let ressourceToUpdate = props.ressourceName;
  if (storeState.value.isParentStoreTarget) {
    if (!storeState.value.parentRessource?.ressource) throw Error('No parent ressource');
    ressourceToUpdate = storeState.value.parentRessource?.ressourceName;
    newRow = { ...storeState.value.parentRessource.ressource };
    const ressourceParam = storeState.value.parentRessource.param ?? props.ressourceName;
    // if (newRow[ressourceParam] instanceof Array)
    //   (newRow[ressourceParam] as Array<GenericRessource>).push(ressourceFromBackend);
    // else newRow[ressourceParam] = ressourceFromBackend;
    newRow[ressourceParam] = ressourceFromBackend;
  } else {
    newRow = ressourceFromBackend;
  }

  store.commit(MutationType.createEditOneRessourceTableRow, {
    ressourceName: ressourceToUpdate,
    row: newRow,
  });
  reinit();
};

const tryToCreateEditRessource = async () => {
  try {
    await createEditRessource();
  } catch (error) {
    const err = error as AxiosError;
    console.error('Could not udpate ressource : ' + err.message);
  }
};
</script>

<template>
  <base-dialog v-model="createEditDialogState" :title="title" @before-hide="closeRessourceTableHeader()">
    <ressource-form
      :ressource="storeState.mode === 'edit' ? storeState.ressourceToEdit : undefined"
      :ressource-form-config="ressourceNameToForm[props.ressourceName]"
      @submit="tryToCreateEditRessource"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
  </base-dialog>
</template>
