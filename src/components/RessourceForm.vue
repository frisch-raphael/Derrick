<script setup lang="ts">
import { RessourceFormGeneric } from '../forms/types';
import { prettyVariable } from '../utils';
import { DataTest } from 'src/enums/enums';
import { toRefs } from 'vue';

defineProps<{
  ressourceFormConfig: RessourceFormGeneric;
}>();
const emit = defineEmits(['ressourceFormUpdate']);
const ressourceTosubmit: Record<string, any> = toRefs({});
const updateForm = (param: string, value: string) => {
  ressourceTosubmit[param] = value;
  emit('ressourceFormUpdate', ressourceTosubmit);
};
</script>

<template>
  <div :data-cy="DataTest.RessourceForm">
    <component
      :is="config.component"
      v-for="(config, param) in ressourceFormConfig"
      :key="param"
      v-bind="config.attrs"
      :label="prettyVariable(param)"
      :icon="config.icon"
      :data-test="`form-${param}`"
      @update:modelValue="updateForm(param, $event)"
    >
    </component>
  </div>
</template>
