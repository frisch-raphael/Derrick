<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { onMounted, computed, ref } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import { engagementColumns } from 'src/pages/columns';
import CreateEditRessourceDialog from '../ui/BaseTable/CreateEditRessourceDialog.vue';
import { GenericRessource } from 'src/types/types';
import { useUiStore } from 'src/stores/ui';
import { useConfigStore } from 'src/stores/config';
import { useRouter } from 'vue-router';

const uiStore = useUiStore();
const configStore = useConfigStore();
const router = useRouter();
const isLoading = ref(true);

// const engagements: Ref<IEngagement[] | undefined> = ref(undefined);
// TODO dans l'api
onMounted(async () => {
  const engagementPromise = request<IEngagement[]>({ method: 'get', url: '/engagements' });
  const configPromise = configStore.updateConfigTranslationEntries();
  const promises = await Promise.all([engagementPromise, configPromise]);
  const engagements = promises[0];
  uiStore.updateRessourceTable(RessourceName.Engagement, engagements.data || []);
  isLoading.value = false;
});

const engagements = computed(() => uiStore.ressourceTableRows.engagement as IEngagement[]);

const goToContact = async (engagement: IEngagement) => {
  await router.push({
    name: 'contacts',
    params: { parentEngagementId: engagement.id },
    query: { engagement: engagement.title },
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
        ><q-tooltip>Company</q-tooltip></q-btn
      >
      <q-btn
        size="sm"
        color="blue"
        rounded
        icon="mdi-account-multiple"
        :data-cy="DataTest.EngagementTableContactBtn"
        @click="goToContact(engagementRow as IEngagement)"
        ><q-tooltip>Contacts</q-tooltip></q-btn
      >
    </template>
  </base-table>
  <create-edit-ressource-dialog :ressource-name="RessourceName.Company"></create-edit-ressource-dialog>
</template>
