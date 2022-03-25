<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { ConfigTranslationEntries } from 'src/types/types';

const props = defineProps<{
  icon: string;
  value: string;
  languageCode: string;
  optionsTranslations: ConfigTranslationEntries;
}>();

const emit = defineEmits(['update:modelValue']);
const model = ref(props.value);

watch(
  () => props.languageCode,
  (newLanguage, oldLanguage) => {
    const oldEntryTranslations = props.optionsTranslations.find((o) => o[oldLanguage] === model.value);
    model.value = oldEntryTranslations?.[newLanguage] || '';
    emit('update:modelValue', model.value);
  }
);

watch(
  () => model.value,
  (newValue) => {
    emit('update:modelValue', newValue);
  }
);

const translatedOptions = computed(() => {
  return props.optionsTranslations.map((o) => o[props.languageCode]);
});
</script>

<template>
  <q-select v-model="model" :options="translatedOptions" data-cy="select-form">
    <template #prepend>
      <q-icon :name="icon" />
    </template>
  </q-select>
</template>
