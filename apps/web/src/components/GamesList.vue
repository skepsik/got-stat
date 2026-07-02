<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useGamesStore } from '@/stores/games';
import { formatGameDate } from '@/utils/format';

const gamesStore = useGamesStore();
const route = useRoute();

onMounted(() => {
  void gamesStore.load();
});

function isActive(gameId: string) {
  return route.params.id === gameId;
}
</script>

<template>
  <div class="d-flex flex-column fill-height games-list">
    <v-list class="flex-grow-1" density="comfortable" nav>
      <v-list-item
        v-for="game in gamesStore.gamesNewestFirst"
        :key="game.id"
        :active="isActive(game.id)"
        :title="formatGameDate(game.playedAt)"
        :to="{ name: 'game', params: { id: game.id } }"
      />
    </v-list>

    <v-divider />

    <div class="pa-4">
      <v-btn block color="primary" disabled prepend-icon="mdi-plus">
        Добавить игру
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.games-list {
  max-width: 300px;
}
</style>
