<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { computed, ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import { engagementColumns } from 'src/pages/RessourceTables/columns';
import CreateEditRessourceDialog from '../../ui/BaseTable/CreateEditRessourceDialog.vue';
import { GenericRessource } from 'src/types/types';
import { useUiStore } from 'src/stores/ui';
import { useRouter } from 'vue-router';
import { prepareRessourceTable } from './functions/prepareReportTable';

const uiStore = useUiStore();
const router = useRouter();
const isLoading = ref(true);
const engagements = computed(() => uiStore.ressourceTableRows.engagement as IEngagement[]);

const goToContact = async (engagement: GenericRessource) => {
  await router.push({
    name: 'contacts',
    params: { parentEngagementId: engagement.id },
    query: { engagement: (engagement as IEngagement).title },
  });
};

const companyClicked = (ressource: GenericRessource) => {
  const company = engagements.value?.find((e) => e.id === ressource.id)?.company;
  uiStore.updateCreateEditRessourceState({
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

prepareRessourceTable(RessourceName.Engagement, isLoading);
</script>

<template>
  <q-linear-progress
    v-if="isLoading"
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
        ><q-tooltip>Edit company</q-tooltip></q-btn
      >
      <q-btn
        size="sm"
        color="blue"
        rounded
        icon="mdi-account-multiple"
        :data-cy="DataTest.EngagementTableContactBtn"
        @click="goToContact(engagementRow)"
        ><q-tooltip>Edit contacts</q-tooltip></q-btn
      >
    </template>
  </base-table>
  <create-edit-ressource-dialog :ressource-name="RessourceName.Company"></create-edit-ressource-dialog>
</template>
