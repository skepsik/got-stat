import type { GotPlayerStats, Player } from '@got-stat/shared';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getGotLeaderboard } from '@/api/got';
import { listPlayers } from '@/api/players';
import { playerLabel } from '@/utils/format';

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([]);
  const leaderboard = ref<GotPlayerStats[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  const playersById = computed(
    () => new Map(players.value.map((player) => [player.id, player])),
  );

  const leaderboardRows = computed(() =>
    [...leaderboard.value].toSorted((left, right) => {
      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }

      if (right.totalGames !== left.totalGames) {
        return right.totalGames - left.totalGames;
      }

      return right.totalScores - left.totalScores;
    }),
  );

  async function load() {
    if (loaded.value || loading.value) {
      return;
    }

    loading.value = true;

    try {
      const [nextPlayers, nextLeaderboard] = await Promise.all([
        listPlayers(),
        getGotLeaderboard(),
      ]);

      players.value = nextPlayers;
      leaderboard.value = nextLeaderboard;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function labelFor(playerId: string | null) {
    if (!playerId) {
      return 'Вассал';
    }

    const player = playersById.value.get(playerId);
    const stats = leaderboard.value.find((row) => row.playerId === playerId);

    return playerLabel(
      player?.displayName ?? stats?.displayName,
      player?.telegram,
    );
  }

  return {
    labelFor,
    leaderboard,
    leaderboardRows,
    load,
    loaded,
    loading,
    players,
    playersById,
  };
});
