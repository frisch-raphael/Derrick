<script setup lang="ts">
import { RessourceFormGeneric } from '../forms/types';
import { prettyVariable } from '../utils';

defineProps<{
  ressource: RessourceFormGeneric;
}>();
</script>

<template>
  <div data-test="ressource-form">
    <component
      :is="config.component"
      v-for="(config, param) in ressource"
      :key="param"
      :label="prettyVariable(param)"
    >
    </component>
  </div>
</template>
