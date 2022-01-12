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
let ressourceTosubmit: Record<string, any> = toRefs({});
const emit = defineEmits(['ressourceFormUpdate', 'submit', 'submitClick']);

const initDefaultValue = () => {
  if (props.ressource) {
    ressourceTosubmit = { ...props.ressource };
    emit('ressourceFormUpdate', ressourceTosubmit);
    return;
  }
  for (const param in props.ressourceFormConfig) {
    ressourceTosubmit[param] = props.ressourceFormConfig[param].default;
    emit('ressourceFormUpdate', ressourceTosubmit);
  }
};
initDefaultValue();

const updateForm = (param: string, value: string) => {
  ressourceTosubmit[param] = value;
  emit('ressourceFormUpdate', ressourceTosubmit);
};
const onSubmit = () => {
  emit('submit');
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
    <q-form ref="ressourceForm" @submit="onSubmit">
      <component
        :is="config.component"
        v-for="(config, param) in ressourceFormConfig"
        :key="param"
        v-bind="config.attrs"
        :label="prettyVariable(param)"
        :icon="config.icon"
        :data-test="`form-${param}`"
        :value="value(param, config.default)"
        :rules="config.rules"
        @update:modelValue="updateForm(param, $event)"
      >
      </component>
      <div align="center" class="q-mt-md">
        <q-btn
          label="Submit"
          :data-cy="DataTest.RessourceFormCreateEditBtn"
          type="submit"
          color="primary"
          @click="emit('submitClick')"
        />
      </div>
    </q-form>
  </div>
</template>
