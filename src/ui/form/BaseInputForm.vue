<script setup lang="ts">
import { reactive } from 'vue';
const props = defineProps<{
  icon: string;
  value?: string;
}>();

const state = reactive({ model: props.value });
</script>

<template>
  <q-input v-model="state.model" data-cy="input-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-input>
</template>
