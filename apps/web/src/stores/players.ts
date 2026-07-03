import type { GotPlayerStats, LeaderboardRatingMode, Player } from '@got-stat/shared';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { getGotLeaderboard } from '@/api/got';
import { listPlayers } from '@/api/players';
import { playerLabel } from '@/utils/format';

export const usePlayersStore = defineStore('players', () => {
  const players = ref<Player[]>([]);
  const leaderboard = ref<GotPlayerStats[]>([]);
  const ratingMode = ref<LeaderboardRatingMode>('average');
  const loading = ref(false);
  const playersLoaded = ref(false);
  const leaderboardLoaded = ref(false);

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

  async function loadPlayers() {
    if (playersLoaded.value) {
      return;
    }

    players.value = await listPlayers();
    playersLoaded.value = true;
  }

  async function loadLeaderboard() {
    leaderboard.value = await getGotLeaderboard(ratingMode.value);
    leaderboardLoaded.value = true;
  }

  async function load() {
    if (loading.value) {
      return;
    }

    loading.value = true;

    try {
      await Promise.all([loadPlayers(), loadLeaderboard()]);
    } finally {
      loading.value = false;
    }
  }

  async function setRatingMode(mode: LeaderboardRatingMode) {
    if (ratingMode.value === mode) {
      return;
    }

    ratingMode.value = mode;
    loading.value = true;

    try {
      await loadLeaderboard();
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
    leaderboardLoaded,
    leaderboardRows,
    load,
    loaded: computed(() => playersLoaded.value && leaderboardLoaded.value),
    loading,
    players,
    playersById,
    playersLoaded,
    ratingMode,
    setRatingMode,
  };
});
