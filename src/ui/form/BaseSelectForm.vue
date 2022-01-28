<script setup lang="ts">
import { reactive, watch, ref } from 'vue';

const props = defineProps<{
  icon: string;
  value: string;
  options: string[];
}>();

const state = reactive({ model: props.value });
const indexOfSelectedOptions = ref(props.options.indexOf(props.value));

//this is used to update the select options after a language change
watch(
  () => props.options,
  (options) => {
    state.model = options[indexOfSelectedOptions.value];
  }
);
//this is used to update the select options after a language change
watch(
  () => state.model,
  (newValue) => {
    indexOfSelectedOptions.value = props.options.indexOf(newValue);
  }
);
</script>

<template>
  <q-select v-model="state.model" :options="props.options" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
