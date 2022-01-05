<script lang="ts" src="./EngagementTable.ts"></script>

<template>
  <base-table
    :columns="engagementColumns"
    ressource-name="engagement"
    :rest-client="engagementRestClient"
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
    <ressource-form
      :ressource-form-config="engagementForm"
      @ressource-form-update="updateEngagementToCreate"
    ></ressource-form>
    <template #actions>
      <q-btn
        data-cy="engagement-create-btn"
        color="primary"
        flat
        @click="createEngagement()"
        >Create</q-btn
      >
    </template>
  </base-dialog>
</template>
