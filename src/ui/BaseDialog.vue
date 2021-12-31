<script lang="ts" setup>
interface Props {
  title: string;
}

withDefaults(defineProps<Props>(), {});

// along with a listener for 'update:model-value' event)
// const isDialogOpen = false;
</script>

<template>
  <q-dialog data-test="base-dialog">
    <q-card style="width: 800px; max-width: 100vw">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <slot></slot>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn v-close-popup flat label="OK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
