<template>
  <q-header elevated>
    <q-toolbar shadow class="bg-white text-black">
      <q-toolbar-title>Columbo</q-toolbar-title>

      <q-space />

      <q-btn text>Engagements list</q-btn>

      <q-btn class="q-ml-xs" data-cy="header-admin-button" text
        >Administration</q-btn
      >

      <q-divider inset vertical />

      <q-btn class="q-mr-xs q-ml-xs" color="primary" plain>
        <q-icon left name="mdi-account-arrow-left" />

        <span>John Leider</span>
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { MenuContext } from '../types';

export default defineComponent({
  name: 'TheHeader',
  // emits: {
  //   menuChanged: (menuContext: MenuContext) => {
  //     return menuContext == 'admin' || 'reporting';
  //   },
  // },
});
</script>
