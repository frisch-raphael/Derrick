<script lang="ts" setup>
  import { ref } from 'vue';
import { DataTest } from 'src/enums/enums';
const filter = ref(''); //TODO link to SearchInput
</script>

<template>
      <q-input v-model="filter" borderless dense debounce="300" placeholder="Search" :data-cy="DataTest.RessourceTableSearchInput">
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>
