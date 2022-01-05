<script setup lang="ts">
import { ref } from 'vue';
defineProps<{
  icon: string;
}>();

const date = ref('');
</script>

<template>
  <q-input
    v-model="date"
    mask="date"
    :rules="['date']"
    data-cy="date-form"
    class="q-pb-none"
  >
    <template #prepend>
      <q-icon name="event" class="cursor-pointer" color="primary">
        <q-popup-proxy
          ref="qDateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="date" minimal>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
