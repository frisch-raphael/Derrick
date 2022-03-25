<script lang="ts">
import { IEngagement } from 'src/dtos/engagement';
import { RouteLocationNormalized, NavigationGuardNext, useRoute } from 'vue-router';
import { Notify } from 'quasar';
export default {
  beforeRouteEnter: (to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!to.params.parentEngagementId) {
      Notify.create({ message: 'You have to choose an engagement', type: 'negative' });
      next({ name: 'engagements' });
      return;
    }
    next();
  },
};
</script>

<script lang="ts" setup>
import { RessourceName, DataTest } from 'src/enums/enums';
import { ref } from 'vue';
import BaseTable from '../../ui/BaseTable/BaseTable.vue';
import { ParentRessource } from 'src/types/types';
import { ressourceConfig } from '../../utils/utils';
import { prepareRessourceTable } from './functions/prepareReportTable';

const props = defineProps<{
  parentEngagementId: string;
}>();
const route = useRoute();
const title = `Contact list for engagement "${route.query.engagement as string}"`;
const isLoading = ref(false);
const parentRessource: ParentRessource<Partial<IEngagement>> = {
  ressourceName: RessourceName.Engagement,
  ressource: { id: parseInt(props.parentEngagementId) },
};
prepareRessourceTable(RessourceName.Contact, isLoading, parentRessource);
</script>
<template>
  <q-linear-progress
    v-if="isLoading"
    indeterminate
    :data-cy="DataTest.ContactTableLoading"
  ></q-linear-progress>
  <BaseTable
    v-else
    grid
    :title="title"
    :parent-ressource="parentRessource"
    :ressource-name="RessourceName.Contact"
    :columns="ressourceConfig.contact.columns"
  ></BaseTable>
</template>
