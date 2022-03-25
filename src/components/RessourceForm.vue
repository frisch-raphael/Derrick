<script setup lang="ts">
import { RessourceFormGeneric } from 'src/forms/types';
import { prettyVariable } from 'src/utils/utils';
import { DataTest } from 'src/enums/enums';
import { reactive, computed } from 'vue';
import { GenericRessource } from 'src/types/types';
import { RessourceFormParams } from '../forms/types';
import { useConfigStore } from 'src/stores/config';
import ISO6391 from 'iso-639-1';

const confStore = useConfigStore();

const props = defineProps<{
  ressourceFormConfig: RessourceFormGeneric;
  ressource?: GenericRessource;
}>();
const state = reactive({ ressourceTosubmit: {} as Record<string, any> });
const emit = defineEmits(['ressourceFormUpdate', 'submit', 'submitClick']);

const initDefaultValues = () => {
  if (props.ressource) {
    state.ressourceTosubmit = { ...props.ressource };
  } else {
    for (const param in props.ressourceFormConfig) {
      state.ressourceTosubmit[param] = props.ressourceFormConfig[param].default;
    }
  }
  emit('ressourceFormUpdate', state.ressourceTosubmit);
};

const getFormAttributes = (config: RessourceFormParams, param: string) => {
  const language = (state.ressourceTosubmit.language as string) || confStore.supportedLanguages?.[0] || '';
  if (!config?.attrs) config.attrs = {};
  // const parametersNeedingTranslation = ['assessment_type', 'finding_type']
  config.attrs.languageCode = ISO6391.getCode(language);
  if (param === 'assessment_type') {
    config.attrs.optionsTranslations = confStore.assessmentTypesTranslations;
  } else if (param === 'finding_type') {
    config.attrs.optionsTranslations = confStore.findingTypesTranslations;
  } else if (param === 'hacker_profile') {
    config.attrs.optionsTranslations = confStore.hackerProfilesTranslations;
  } else if (param === 'language') {
    config.attrs.options = confStore.supportedLanguages;
    config.attrs.value = confStore.supportedLanguages?.[0];
  }
  return config.attrs;
};

const updateForm = (param: string, value: string) => {
  state.ressourceTosubmit[param] = value;
  emit('ressourceFormUpdate', state.ressourceTosubmit);
};

const onSubmit = () => {
  emit('submit');
};

const getValue = (param: string, defaultValue?: string) => {
  // if there's a ressource to edit we send it as the value
  // else the default value (i.e param = state => 'Ongoing')
  // else nothing
  if (props.ressource) {
    return props.ressource[param] as string;
  } else return defaultValue;
};

const languageCode = computed(() =>
  ISO6391.getCode(state.ressourceTosubmit.language || confStore.supportedLanguages?.[0] || '')
);

initDefaultValues();
</script>

<template>
  <div :data-cy="DataTest.RessourceForm">
    <q-form ref="ressourceForm" @submit="onSubmit">
      <component
        :is="config.component"
        v-for="(config, param) in ressourceFormConfig"
        :key="param"
        v-bind="getFormAttributes(config, param)"
        :label="prettyVariable(param)"
        :icon="config.icon"
        :data-test="`form-${param}`"
        :value="getValue(param, config.default)"
        :rules="config.rules"
        :language-code="languageCode"
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
