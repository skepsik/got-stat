<script setup lang="ts">
import { onMounted } from 'vue';

import { usePlayersStore } from '@/stores/players';
import { playerLabel } from '@/utils/format';

const playersStore = usePlayersStore();

onMounted(() => {
  void playersStore.load();
});
</script>

<template>
  <div class="d-flex flex-column fill-height players-list">
    <v-progress-linear
      v-if="playersStore.loading"
      color="primary"
      indeterminate
    />

    <v-list class="flex-grow-1" density="comfortable" nav>
    <v-list-item
      v-for="row in playersStore.leaderboardRows"
      :key="row.playerId"
      :subtitle="`игр: ${row.totalGames} очков: ${row.totalScores}`"
      :title="playerLabel(row.displayName, playersStore.playersById.get(row.playerId)?.telegram)"
    >
      <template #prepend>
        <v-avatar color="primary" size="40">
          <span class="text-body-2 font-weight-bold">{{ row.rating }}</span>
        </v-avatar>
      </template>
    </v-list-item>
    </v-list>
  </div>
</template>
