<script setup lang="ts">
import { ref, toRef, reactive } from 'vue';

const props = defineProps<{
  icon: string;
  default: string;
}>();

const state = reactive({ model: props.default });
</script>

<template>
  <q-select v-model="state.model" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
