<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { RessourceName } from 'src/enums/enums';
import RestClient from 'src/classes/api/restClient';
import { capitalizeFirstLetter, ressourceConfig } from 'src/utils/utils';
import BaseDialog from 'src/ui/BaseDialog.vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { GenericRessource } from 'src/types/types';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import ISO6391 from 'iso-639-1';

const uiStore = useUiStore();
const confStore = useConfigStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();
const emits = defineEmits(['loading-changed']);

// const defaultState: CreateEditDialogState = { mode: 'create', isOpen: false };
const storeState = computed(() => uiStore.createEditRessourceStatus[props.ressourceName]);
let createEditDialogState = computed({
  get: () => !!uiStore.createEditRessourceStatus[props.ressourceName]?.isOpen,
  set(newState: boolean) {
    uiStore.createEditRessourceFormOpenClose(props.ressourceName, newState);
  },
});
const localState: Record<string, { language?: string }> = reactive({ newCreateEditRessource: {} });
const title = computed(() => {
  if (storeState.value?.parentRessource?.ressource) return `${capitalizeFirstLetter(props.ressourceName)}`;
  return storeState.value?.mode === 'create'
    ? `create new ${props.ressourceName}`
    : `edit ${props.ressourceName}`;
});

const updateRessourceToCreate = (ressource: Record<string, { language?: string }>) =>
  (localState.newCreateEditRessource = { ...ressource });
const closeRessourceTableHeader = () => {
  uiStore.updateRessourceMenu(props.ressourceName, false);
};
const reinit = () => {
  closeRessourceTableHeader();
  createEditDialogState.value = false;
  localState.newCreateEditRessource = {};
  uiStore.reinitCreateEditRessourceState(props.ressourceName);
};
const createEditRessource = async () => {
  const mode = uiStore.createEditRessourceStatus[props.ressourceName]?.mode;
  let client: RestClient;
  client = storeState.value?.parentRessource
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
    if (!storeState.value?.ressourceToEdit) throw Error('Editing ressource but none found');
    ressourceFromBackend = await client.update<GenericRessource>(
      storeState.value?.ressourceToEdit.id,
      localState.newCreateEditRessource
    );
  }
  let newRow: GenericRessource;
  let ressourceToUpdate = props.ressourceName;
  if (storeState.value?.isParentStoreTarget) {
    if (!storeState.value?.parentRessource?.ressource) throw Error('No parent ressource');
    ressourceToUpdate = storeState.value?.parentRessource?.ressourceName;
    newRow = { ...storeState.value?.parentRessource.ressource };
    const ressourceParam = storeState.value?.parentRessource.param ?? props.ressourceName;
    newRow[ressourceParam] = ressourceFromBackend;
  } else {
    newRow = ressourceFromBackend;
  }

  uiStore.createEditOneRessourceTableRow(ressourceToUpdate, newRow);
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
const getLanguage = () => {
  const languageCode = localState.newCreateEditRessource.language ?? confStore.supportedLanguages?.[0];
  if (!languageCode) throw new Error('No language code found');
  return ressourceConfig[props.ressourceName].getForm(confStore, ISO6391.getCode(languageCode));
};
</script>

<template>
  <base-dialog v-model="createEditDialogState" :title="title" @before-hide="closeRessourceTableHeader()">
    <ressource-form
      :ressource="storeState?.mode === 'edit' ? storeState?.ressourceToEdit : undefined"
      :ressource-form-config="getLanguage()"
      @submit="tryToCreateEditRessource"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
  </base-dialog>
</template>
