<template>
  <q-page-container>
    <q-page>
      <router-view v-slot="{ Component }">
        <!-- https://github.com/vuejs/vue-router-next/issues/560 -->
        <suspense timeout="0">
          <template #default>
            <component :is="Component"> </component>
          </template>
          <template #fallback>
            <q-linear-progress query></q-linear-progress>
          </template>
        </suspense>
      </router-view>
    </q-page>
  </q-page-container>
</template>
