<script setup lang="ts">
import { ref, toRef, reactive } from 'vue';

const props = defineProps<{
  icon: string;
  value: string;
}>();

const state = reactive({ model: props.value });
</script>

<template>
  <q-select v-model="state.model" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
