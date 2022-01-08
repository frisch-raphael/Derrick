<script setup lang="ts">
import { RessourceFormGeneric } from 'src/forms/types';
import { prettyVariable } from 'src/utils';
import { DataTest } from 'src/enums/enums';
import { toRefs } from 'vue';
import { GenericRessource } from 'src/types/types';

const props = defineProps<{
  ressourceFormConfig: RessourceFormGeneric;
  ressource?: GenericRessource;
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
const value = (param: string, defaultValue?: string) => {
  // if there's a ressource to edit we send it as the value
  // else the default value (i.e param = state => 'Ongoing')
  // else nothing
  if (props.ressource) {
    return props.ressource[param] as string;
  } else return defaultValue;
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
      :value="value(param, config.default)"
      @update:modelValue="updateForm(param, $event)"
    >
    </component>
  </div>
</template>
