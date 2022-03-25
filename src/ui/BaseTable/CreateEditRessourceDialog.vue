<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import RestClient from 'src/classes/api/restClient';
import { capitalizeFirstLetter, prettyVariable, ressourceConfig } from 'src/utils/utils';
import BaseDialog from 'src/ui/BaseDialog.vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { GenericRessource } from 'src/types/types';
import { AxiosError } from 'axios';
import { Notify } from 'quasar';
import { useUiStore } from 'src/stores/ui';
import equal from 'fast-deep-equal';

const uiStore = useUiStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();
const emits = defineEmits(['loading-changed']);

// const defaultState: CreateEditDialogState = { mode: 'create', isOpen: false };

const localState: Record<string, { language?: string }> = reactive({ newCreateEditRessource: {} });
const storeState = computed(() => uiStore.createEditRessourceStatus[props.ressourceName]);
const originalRessourceValue = computed(() => storeState.value?.ressourceToEdit);
const hasRessourceChanged = ref(false);
const isHideConfirmed = ref(false);
const isHideDialogOpen = ref(false);
const isSubmitCliked = ref(false);
const isRessourceLoaded = ref(false);
const mode = computed(() => uiStore.createEditRessourceStatus[props.ressourceName]?.mode);

let createEditDialogState = computed({
  get: () => !!uiStore.createEditRessourceStatus[props.ressourceName]?.isOpen,
  set(newState: boolean) {
    if (!isSubmitCliked.value && hasRessourceChanged.value && !isHideConfirmed.value) {
      isHideDialogOpen.value = true;
      return;
    }
    uiStore.createEditRessourceFormOpenClose(props.ressourceName, newState);
  },
});

const title = computed(() => {
  if (storeState.value?.parentRessource?.ressource) return `${capitalizeFirstLetter(props.ressourceName)}`;
  return storeState.value?.mode === 'create'
    ? `create new ${prettyVariable(props.ressourceName)}`
    : `edit ${prettyVariable(props.ressourceName)}`;
});

const updateRessourceToCreate = (ressource: Record<string, any>) => {
  isSubmitCliked.value = false;
  hasRessourceChanged.value =
    mode.value === 'edit' ? !equal(originalRessourceValue.value, ressource) : isRessourceLoaded.value;
  localState.newCreateEditRessource = { ...ressource };
  isRessourceLoaded.value = true;
};

const beforeHide = () => {
  isRessourceLoaded.value = false;
  uiStore.updateRessourceMenu(props.ressourceName, false);
};

const reinit = () => {
  beforeHide();
  createEditDialogState.value = false;
  localState.newCreateEditRessource = {};
  isHideDialogOpen.value = false;
  uiStore.reinitCreateEditRessourceState(props.ressourceName);
  isRessourceLoaded.value = false;
};

const createEditRessource = async () => {
  let client: RestClient;
  client = storeState.value?.parentRessource
    ? new RestClient(props.ressourceName, storeState.value.parentRessource)
    : new RestClient(props.ressourceName);

  let ressourceFromBackend: GenericRessource;
  if (mode.value === 'create') {
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
};

const tryToCreateEditRessource = async () => {
  try {
    await createEditRessource();
  } catch (error) {
    const err = error as AxiosError;
    console.error('Could not udpate ressource : ' + err.message);
  }
};

const submitCliked = async () => {
  isSubmitCliked.value = true;
  createEditDialogState.value = false;
  await tryToCreateEditRessource();
  reinit();
};

const closeConfirmed = () => {
  isHideConfirmed.value = true;
  isHideDialogOpen.value = false;
  createEditDialogState.value = false;
  isHideConfirmed.value = false;
  isSubmitCliked.value = false;

  reinit();
};
</script>

<template>
  <base-dialog v-model="createEditDialogState" :title="title" @before-hide="beforeHide()">
    <ressource-form
      :ressource="storeState?.mode === 'edit' ? storeState?.ressourceToEdit : undefined"
      :ressource-form-config="ressourceConfig[props.ressourceName].form"
      @submit="submitCliked()"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
  </base-dialog>
  <base-dialog
    v-model="isHideDialogOpen"
    actions-align="center"
    :title="'Are you sure?'"
    :data-cy="DataTest.RessourceFormConfirmation"
  >
    The changes you made won't get saved!
    <template #actions>
      <q-btn icon="mdi-check" :data-cy="DataTest.CreateEditConfirmClose" @click="closeConfirmed()"></q-btn>
    </template>
  </base-dialog>
</template>
