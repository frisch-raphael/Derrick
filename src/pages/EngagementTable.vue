<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { onMounted, computed } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import { useStore } from 'src/store';
import { ActionType } from 'src/store/columbo/action-types';
import { engagementColumns } from 'src/pages/columns';
import CreateEditRessourceDialog from '../ui/BaseTable/CreateEditRessourceDialog.vue';
import { MutationType } from 'src/store/columbo/mutations-types';
import { GenericRessource } from 'src/types/types';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

// const engagements: Ref<IEngagement[] | undefined> = ref(undefined);
// TODO dans l'api
onMounted(async () => {
  const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
  await store.dispatch(ActionType.updateRessourceTable, {
    ressourceName: RessourceName.Engagement,
    rows: response.data || [],
  });
});

const engagements = computed(
  () => store.getters.RessourceTableRows(RessourceName.Engagement) as IEngagement[]
);
const companyClicked = (ressource: GenericRessource) => {
  const company = engagements.value?.find((e) => e.id === ressource.id)?.company;
  store.commit(MutationType.updateCreateEditRessourceState, {
    isOpen: true,
    mode: company ? 'edit' : 'create',
    ressourceName: RessourceName.Company,
    ressourceToEdit: company,
    isParentStoreTarget: true,
    parentRessource: {
      ressourceName: RessourceName.Engagement,
      ressource: ressource,
    },
  });
};
</script>

<template>
  <q-linear-progress
    v-if="engagements === undefined"
    indeterminate
    :data-cy="DataTest.EngagementTableLoading"
  ></q-linear-progress>
  <base-table v-else :columns="engagementColumns" :ressource-name="RessourceName.Engagement" :grid="true">
    <template #card-bottom-actions="{ row: engagementRow }">
      <q-btn
        :data-cy="DataTest.EngagementTableCompanyBtn"
        icon="mdi-domain"
        size="sm"
        color="black"
        rounded
        @click="companyClicked(engagementRow)"
        ><q-tooltip>Company</q-tooltip></q-btn
      >
      <q-btn
        size="sm"
        color="blue"
        rounded
        icon="mdi-account-multiple"
        @click="router.push({ name: 'contacts', params: { parentEngagementId: engagementRow.id } })"
        ><q-tooltip>Contacts</q-tooltip></q-btn
      >
    </template>
  </base-table>
  <create-edit-ressource-dialog :ressource-name="RessourceName.Company"></create-edit-ressource-dialog>
</template>
