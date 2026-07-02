import type { GotGame } from '@got-stat/shared';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { listGotGames } from '@/api/got';
import { useReferenceStore } from '@/stores/reference';

export const useGamesStore = defineStore('games', () => {
  const games = ref<GotGame[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  const referenceStore = useReferenceStore();

  const gamesNewestFirst = computed(() =>
    [...games.value].toSorted(
      (left, right) =>
        new Date(right.playedAt).getTime() - new Date(left.playedAt).getTime(),
    ),
  );

  async function load() {
    if (loaded.value || loading.value) {
      return;
    }

    loading.value = true;

    try {
      await referenceStore.load();
      games.value = await listGotGames();
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function getById(id: string) {
    return games.value.find((game) => game.id === id);
  }

  return {
    games,
    gamesNewestFirst,
    getById,
    load,
    loaded,
    loading,
  };
});
