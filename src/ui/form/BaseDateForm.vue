<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps<{
  label: string;
}>();

const date = ref(new Date());
const proxyDate = ref(new Date());
const updateProxy = () => {
  proxyDate.value = date.value;
};
const save = () => {
  date.value = proxyDate.value;
};
</script>

<template>
  <q-btn color="primary" class="q-my-sm">
    <q-popup-proxy
      cover
      transition-show="scale"
      transition-hide="scale"
      @before-show="updateProxy"
    >
      <q-date v-model="proxyDate">
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn v-close-popup label="Cancel" color="primary" flat />
          <q-btn v-close-popup label="OK" color="primary" flat @click="save" />
        </div>
      </q-date>
    </q-popup-proxy>
    {{ props.label }}
  </q-btn>
  <br />
</template>
