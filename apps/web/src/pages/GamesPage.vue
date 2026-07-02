<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import GamesList from '@/components/GamesList.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useGamesStore } from '@/stores/games';

const gamesStore = useGamesStore();
const route = useRoute();
const router = useRouter();

async function ensureGameSelected() {
  await gamesStore.load();

  const firstGame = gamesStore.gamesNewestFirst[0];

  if (route.name === 'games' && firstGame) {
    await router.replace({
      name: 'game',
      params: { id: firstGame.id },
    });
  }
}

onMounted(() => {
  void ensureGameSelected();
});

watch(
  () => route.name,
  () => {
    void ensureGameSelected();
  },
);
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <GamesList />
    </template>

    <router-view />
  </AppLayout>
</template>
