<script lang="ts" src="./SearchInput.ts"></script>

<template>
  <q-input
    v-model="filter"
    borderless
    dense
    debounce="300"
    placeholder="Search"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </q-input>
</template>
