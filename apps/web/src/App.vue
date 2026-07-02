<script setup lang="ts">
import { onMounted } from 'vue';

import { useReferenceStore } from '@/stores/reference';

const referenceStore = useReferenceStore();

const navItems = [
  { title: 'Партии', icon: 'mdi-view-dashboard', route: { name: 'games' } },
  { title: 'Игроки', icon: 'mdi-account-circle-outline', route: { name: 'players' } },
  { title: 'Дома', icon: 'mdi-castle', route: { name: 'houses' } },
  { title: 'Рандомайзер', icon: 'mdi-dice-multiple', route: { name: 'randomizer' } },
];

onMounted(() => {
  void referenceStore.load();
});
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent rail rail-width="56" width="300">
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.route"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main class="d-flex flex-column">
      <router-view />
    </v-main>
  </v-app>
</template>
