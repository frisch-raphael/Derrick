<script lang="ts">
import { IEngagement } from 'src/dtos/engagement';
import { RouteLocationNormalized, NavigationGuardNext, useRoute } from 'vue-router';
import { Notify } from 'quasar';
export default {
  beforeRouteEnter: (to: RouteLocationNormalized, _: RouteLocationNormalized, next: NavigationGuardNext) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!to.params.parentEngagementId) {
      Notify.create({ message: 'You have to choose an engagement', type: 'negative' });
      //   await router.push({ name: 'engagements' });
      next({ name: 'engagements' });
      return;
    }
    next();
  },
};
</script>

<script lang="ts" setup>
import { RessourceName, DataTest } from 'src/enums/enums';
import { onMounted, ref } from 'vue';
import BaseTable from '../ui/BaseTable/BaseTable.vue';
import { ParentRessource } from 'src/types/types';
import { ressourceConfig } from '../utils/utils';
import RestClient from 'src/classes/api/restClient';
import { IContact } from 'src/dtos/contact';
import { useUiStore } from 'src/stores/ui';

const props = defineProps<{
  parentEngagementId: string;
}>();
const store = useUiStore();
const route = useRoute();
const title = `Contact list for engagement ${route.query.engagement as string}`;
const loading = ref(false);
const parentRessource: ParentRessource<Partial<IEngagement>> = {
  ressourceName: RessourceName.Engagement,
  ressource: { id: parseInt(props.parentEngagementId) },
};

onMounted(async () => {
  loading.value = true;
  store.updateRessourceTable(RessourceName.Contact, []);
  const parentRessource: ParentRessource = {
    ressourceName: RessourceName.Engagement,
    ressource: { id: parseInt(props.parentEngagementId) },
  };
  try {
    const contacts = await new RestClient(RessourceName.Contact, parentRessource).index<IContact>();
    store.updateRessourceTable(RessourceName.Contact, contacts || []);
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
});
</script>
<template>
  <q-linear-progress v-if="loading" indeterminate :data-cy="DataTest.ContactTableLoading"></q-linear-progress>
  <BaseTable
    v-else
    grid
    :title="title"
    :parent-ressource="parentRessource"
    :ressource-name="RessourceName.Contact"
    :columns="ressourceConfig.contact.columns"
  ></BaseTable>
</template>
