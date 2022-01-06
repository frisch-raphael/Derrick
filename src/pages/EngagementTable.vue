<script lang="ts" src="./EngagementTable.ts"></script>

<template>
  <base-table
    :columns="engagementColumns"
    ressource-name="engagement"
    :rest-client="engagementRestClient"
  >
    <template #card-buttons>
      <q-btn class="q-ma-sm" rounded icon="mdi-domain"></q-btn>
      <q-btn class="q-ma-sm q-ml-sm" rounded icon="mdi-content-save"></q-btn>
    </template>
  </base-table>
</template>
