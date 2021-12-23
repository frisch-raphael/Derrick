<template>
  <q-layout>
    <TheHeader />
    <q-drawer show-if-above :width="250" elevated>
      <TheDrawer
        report-title="Test d'intrusion externe clinique de Durtol"
        context="administration"
      />
    </q-drawer>
    <ThePageContainer></ThePageContainer>
  </q-layout>
</template>

<script lang="ts">
import TheHeader from './components/TheHeader.vue';
import TheDrawer from './components/TheDrawer.vue';
import ThePageContainer from './components/ThePageContainer.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
    TheDrawer,
    ThePageContainer,
  },
});
</script>
