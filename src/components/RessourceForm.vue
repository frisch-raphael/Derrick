<script setup lang="ts">
import { RessourceFormGeneric } from '../forms/types';
import { prettyVariable } from '../utils';
import { DataTest } from 'src/enums/enums';
import { toRefs } from 'vue';

const props = defineProps<{
  ressourceFormConfig: RessourceFormGeneric;
}>();
const ressourceTosubmit: Record<string, any> = toRefs({});
const emit = defineEmits(['ressourceFormUpdate']);

const initDefaultValue = () => {
  for (const param in props.ressourceFormConfig) {
    ressourceTosubmit[param] = props.ressourceFormConfig[param].default;
  }
};
initDefaultValue();

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
      :default="config.default"
      @update:modelValue="updateForm(param, $event)"
    >
    </component>
  </div>
</template>
