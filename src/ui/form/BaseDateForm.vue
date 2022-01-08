<script setup lang="ts">
import { ref, reactive } from 'vue';
import { DataTest } from 'src/enums/enums';
const props = defineProps<{
  icon: string;
  value: string;
}>();

const state = reactive({ date: props.value });

const emit = defineEmits(['update:modelValue']);
const isDialogOpen = ref(false);
const dateChanged = (payload: any) => {
  isDialogOpen.value = false;
  emit('update:modelValue', payload);
};
</script>

<template>
  <q-input
    v-model="state.date"
    mask="date"
    :rules="['date']"
    data-cy="date-form"
    class="q-pb-none"
    @update:modelValue="dateChanged"
  >
    <template #prepend>
      <q-icon
        clickable
        name="event"
        class="cursor-pointer"
        color="primary"
        :data-cy="DataTest.FormDateOpenBtn"
        @click="isDialogOpen = true"
      >
      </q-icon>
      <q-dialog
        v-model="isDialogOpen"
        :data-cy="DataTest.FormDateDialog"
        target="false"
        cover
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date v-model="state.date" minimal @update:modelValue="dateChanged"> </q-date>
      </q-dialog>
    </template>
  </q-input>
</template>
