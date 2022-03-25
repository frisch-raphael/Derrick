<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{
  icon: string;
  value: string;
  options: string[];
}>();

const state = reactive({ model: props.value });
</script>

<template>
  <q-select v-model="state.model" :options="props.options" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
