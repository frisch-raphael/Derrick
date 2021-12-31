<script lang="ts" src="./EngagementTable.ts"></script>

<template>
  <base-table
    :columns="engagementColumns"
    :p-rows="engagementsRows"
    ressource-name="engagement"
    :rest-client="engagementRestClient"
    :p-is-header-menu-open="isHeaderMenuOpen"
    @add="isCreateEngagementOpen = true"
  >
    <template #card-buttons>
      <q-btn class="q-ma-sm" rounded icon="mdi-domain"></q-btn>
      <q-btn class="q-ma-sm q-ml-sm" rounded icon="mdi-content-save"></q-btn>
    </template>
  </base-table>
  <base-dialog
    title="Create new engagement"
    :model-value="isCreateEngagementOpen"
    @before-hide="hideAll()"
  >
    <ressource-form :ressource="engagementForm"></ressource-form>
  </base-dialog>
</template>
