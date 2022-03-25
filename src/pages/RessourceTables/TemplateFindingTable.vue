<script setup lang="ts">
import BaseTable from 'src/ui/BaseTable/BaseTable.vue';

import { RessourceName, DataTest } from 'src/enums/enums';
import { ref } from 'vue';
import { prepareRessourceTable } from './functions/prepareReportTable';
import { templateFindingColumns } from './columns';
const isLoading = ref(true);

prepareRessourceTable(RessourceName.TemplateFinding, isLoading);
</script>

<template>
  <q-linear-progress
    v-if="isLoading"
    indeterminate
    :data-cy="DataTest.EngagementTableLoading"
  ></q-linear-progress>
  <base-table
    v-else
    :columns="templateFindingColumns"
    :ressource-name="RessourceName.TemplateFinding"
    :grid="false"
  >
  </base-table>
</template>
