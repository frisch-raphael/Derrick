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

const store = useStore();

const props = defineProps<{
  ressourceName: RessourceName;
}>();

let createDialogState = computed({
  get(): boolean {
    return !!store.state.columbo.isCreateDialogOpenFor[props.ressourceName];
  },
  set(newState: boolean): void {
    store.commit(MutationType.updateCreateRessourceDialog, {
      ressource: props.ressourceName,
      isOpen: newState,
    });
  },
});

const ressourceToCreate: Ref<Record<any, string>> = ref({ title: '' });

const updateRessourceToCreate = (ressource: Record<string, any>) =>
  (ressourceToCreate.value = { ...ressource });

const reinit = () => {
  store.commit(MutationType.updateRessourceMenu, {
    ressource: props.ressourceName,
    isOpen: false,
  });
  createDialogState.value = false;
  ressourceToCreate.value = { title: '' };
};

const createRessource = async () => {
  const ressourceFromBackend = await new RestClient(
    ressourceNameToApi[props.ressourceName]
  ).create<{ id: number }>(ressourceToCreate.value);

  const ressourceRowNumber = store.getters.baseTableRows(
    props.ressourceName
  ).length;

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

const tryToCreateRessource = async () => {
  try {
    await createRessource();
  } catch (err) {
    const error = err as AxiosError;
    console.log(`could not create ${props.ressourceName}: ${error.message}`);
  }
};
</script>

<template>
  <base-dialog
    v-model="createDialogState"
    :title="`create new ${props.ressourceName}`"
    @before-hide="reinit()"
  >
    <ressource-form
      :ressource-form-config="ressourceNameToForm[props.ressourceName]"
      @ressource-form-update="updateRessourceToCreate"
    ></ressource-form>
    <template #actions>
      <q-btn
        data-cy="engagement-create-btn"
        color="primary"
        flat
        @click="tryToCreateRessource()"
        >Create</q-btn
      >
    </template>
  </base-dialog>
</template>
