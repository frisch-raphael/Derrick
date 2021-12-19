<script lang="ts" src="./TheDrawer.ts"></script>

<template>
  <q-scroll-area class="fit">
    <q-list>
      <template v-for="(menuItem, index) in currentMenu" :key="index">
        <q-item
          v-if="menuItem.name"
          v-ripple
          clickable
          :active="menuItem.name === 'Outbox'"
        >
          <q-item-section v-if="menuItem.icon" avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section
            v-if="menuItem.name"
            :data-test="menuItem.name"
            :class="getDrawerTitleClasses(menuItem.isTitle)"
          >
            {{ menuItem.name }}
          </q-item-section>
        </q-item>
        <q-separator v-if="menuItem.isSeparator" :key="'sep' + index" />
      </template>
    </q-list>
  </q-scroll-area>
</template>
