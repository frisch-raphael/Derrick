<template>
  <q-page-container>
    <q-page>
      <router-view v-slot="{ Component }">
        <!-- https://github.com/vuejs/vue-router-next/issues/560 -->
        <component :is="Component"> </component>
      </router-view>
    </q-page>
  </q-page-container>
</template>
