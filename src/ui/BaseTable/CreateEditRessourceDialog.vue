<script lang="ts" setup>
import { ref, Ref, computed } from 'vue';
import { RessourceName } from 'src/enums/enums';
import { useStore } from 'src/store';
import { MutationType } from 'src/store/columbo/mutations-types';
import { capitalizeFirstLetter, ressourceNameToApi } from 'src/utils';
import RestClient from 'src/classes/api/engagement';
import { ressourceNameToForm } from 'src/utils';
import BaseDialog from 'src/ui/BaseDialog.vue';
import RessourceForm from 'src/components/RessourceForm.vue';
import { AxiosError } from 'axios';
import { CreateEditDialogState } from 'src/store/columbo/state';
import { GenericRessource } from 'src/types/types';

const store = useStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();

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

const ressourceToCreateEdit: Ref<Partial<GenericRessource>> = ref({ title: '' });

const updateRessourceToCreate = (ressource: GenericRessource) =>
  (ressourceToCreateEdit.value = { ...ressource });

const reinit = () => {
  store.commit(MutationType.updateRessourceMenu, {
    ressource: props.ressourceName,
    isOpen: false,
  });
  createEditDialogState.value = false;
  ressourceToCreateEdit.value = { title: '' };
};

const title = computed(() =>
  state.value.mode === 'create' ? `create new ${props.ressourceName}` : `edit ${props.ressourceName}`
);

const createEditRessource = async () => {
  const mode = store.getters.createEditRessourceStatus(props.ressourceName).mode;

  const client = new RestClient(ressourceNameToApi[props.ressourceName]);

  let ressourceFromBackend: GenericRessource;
  if (mode === 'create')
    ressourceFromBackend = await client.create<GenericRessource>(ressourceToCreateEdit.value);
  else {
    if (!ressourceToCreateEdit.value.id) {
      throw Error('Trying to create ressource but no id');
    }
    ressourceFromBackend = await client.update<GenericRessource>(
      ressourceToCreateEdit.value.id,
      ressourceToCreateEdit.value
    );
  }
  const ressourceRowNumber = store.getters.baseTableRows(props.ressourceName).length;

  const newRessourceRow = {
    ...ressourceFromBackend,
    name: `${capitalizeFirstLetter(props.ressourceName)} ${ressourceRowNumber + 1}`,
  };
  store.commit(MutationType.addOneRessourceTable, {
    ressource: props.ressourceName,
    row: newRessourceRow,
  });

  reinit();
};

const tryToCreateEditRessource = async () => {
  try {
    await createEditRessource();
  } catch (err) {
    const error = err as AxiosError;
    console.log(`could not ${state.value.mode} ${props.ressourceName}: ${error.message}`);
  }
};
</script>

<template>
  <base-dialog v-model="createEditDialogState" :title="title" @before-hide="reinit()">
    <ressource-form
      :ressource="state.mode === 'edit' ? state.ressourceToEdit : undefined"
      :ressource-form-config="ressourceNameToForm[props.ressourceName]"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
    <template #actions>
      <q-btn data-cy="engagement-create-btn" color="primary" flat @click="tryToCreateEditRessource()">
        {{ state.mode }}
      </q-btn>
    </template>
  </base-dialog>
</template>
