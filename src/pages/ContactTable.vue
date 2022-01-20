<script lang="ts">
import { IEngagement } from 'src/dtos/engagement';
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
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
import { Notify } from 'quasar';
import { RessourceName, DataTest } from 'src/enums/enums';
import { onMounted, ref } from 'vue';
import BaseTable from '../ui/BaseTable/BaseTable.vue';
import { ParentRessource } from 'src/types/types';
import { ressourceConfig } from '../utils';
import RestClient from 'src/classes/api/restClient';
import { IContact } from 'src/dtos/contact';
import { useStore } from 'src/stores';

const props = defineProps<{
  parentEngagementId: string;
}>();
const store = useStore();

const loading = ref(false);

// const parentEngagement = computed(() => {
//   const engagements = store.getters.RessourceTableRows<IEngagement>(RessourceName.Engagement);
//   return engagements?.find((e) => e.id === parseInt(props.parentEngagementId));
// });
const parentRessource: ParentRessource<Partial<IEngagement>> = {
  ressourceName: RessourceName.Engagement,
  ressource: { id: parseInt(props.parentEngagementId) },
};
onMounted(async () => {
  loading.value = true;
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
    :parent-ressource="parentRessource"
    :ressource-name="RessourceName.Contact"
    :columns="ressourceConfig.contact.columns"
  ></BaseTable>
</template>
