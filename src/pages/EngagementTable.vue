<script setup lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ref, Ref, reactive, onMounted } from 'vue';
import { IEngagement } from 'src/dtos/engagement';
import request from 'src/axios';
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';
import { RessourceName, DataTest } from 'src/enums/enums';
import { useStore } from 'src/store';
import { ActionType } from 'src/store/columbo/action-types';
import { engagementColumns } from 'src/pages/columns';
import CreateEditRessourceDialog from '../ui/BaseTable/CreateEditRessourceDialog.vue';
import { MutationType } from 'src/store/columbo/mutations-types';
import { ParentRessource } from 'src/types/types';

const store = useStore();

const parentEngamement: ParentRessource = reactive({ ressource: RessourceName.Engagement, id: undefined });
const engagements: Ref<IEngagement[]> = ref([]);
// TODO dans l'api
onMounted(async () => {
  const response = await request<IEngagement[]>({ method: 'get', url: '/engagements' });
  engagements.value = response.data;
  await store.dispatch(ActionType.updateRessourceTable, {
    ressource: RessourceName.Engagement,
    rows: engagements.value,
  });
});

const companyClicked = (id: number) => {
  parentEngamement.id = id;
  openCompanyDialog();
};
const openCompanyDialog = () => {
  store.commit(MutationType.updateCreateEditRessourceState, {
    isOpen: true,
    mode: 'create',
    ressource: RessourceName.Company,
    ressourceToEdit: { id: 0 },
  });
};
</script>

<template>
  <q-linear-progress v-if="!engagements.length" indeterminate></q-linear-progress>
  <base-table :columns="engagementColumns" :ressource-name="RessourceName.Engagement">
    <template #card-bottom-actions="{ row }">
      <q-btn
        :data-cy="DataTest.EngagementTableCompanyBtn"
        icon="mdi-domain"
        size="sm"
        color="black"
        rounded
        @click="companyClicked(row.id)"
        ><q-tooltip>Manage associated company</q-tooltip></q-btn
      >
      <q-btn size="sm" color="blue" rounded icon="mdi-content-save"
        ><q-tooltip>Manage associated contacts</q-tooltip></q-btn
      >
    </template>
  </base-table>
  <create-edit-ressource-dialog
    :parent-ressource="parentEngamement"
    :ressource-name="RessourceName.Company"
  ></create-edit-ressource-dialog>
</template>
<!-- <q-btn
          v-for="action in actions"
          :key="action.icon"
          rounded
          size="sm"
          :data-cy="'table-card-action-' + action.name"
          :color="action.color"
          :icon="action.icon"
          @click="launchAction(action, tableItem.row)"
        >
          <q-tooltip>{{ action.tooltip }}</q-tooltip>
        </q-btn> -->
