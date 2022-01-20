<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { onMounted, computed } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import { engagementColumns } from 'src/pages/columns';
import CreateEditRessourceDialog from '../ui/BaseTable/CreateEditRessourceDialog.vue';
import { GenericRessource } from 'src/types/types';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores';

const store = useStore();
const router = useRouter();

// const engagements: Ref<IEngagement[] | undefined> = ref(undefined);
// TODO dans l'api
onMounted(async () => {
  const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
  store.updateRessourceTable(RessourceName.Engagement, response.data || []);
});

const engagements = computed(() => store.ressourceTableRows.engagement as IEngagement[]);

const companyClicked = (ressource: GenericRessource) => {
  const company = engagements.value?.find((e) => e.id === ressource.id)?.company;
  store.updateCreateEditRessourceState({
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
