<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  icon: string;
}>();

const model = ref('');
</script>

<template>
  <q-select v-model="model" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
