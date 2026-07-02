import type { GotGameType, GotHouse } from '@got-stat/shared';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { listGotGameTypes, listGotHouses } from '@/api/got';

export const useReferenceStore = defineStore('reference', () => {
  const houses = ref<GotHouse[]>([]);
  const gameTypes = ref<GotGameType[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  const housesById = computed(
    () => new Map(houses.value.map((house) => [house.id, house])),
  );

  const gameTypesById = computed(
    () => new Map(gameTypes.value.map((type) => [type.id, type])),
  );

  async function load() {
    if (loaded.value || loading.value) {
      return;
    }

    loading.value = true;

    try {
      const [nextHouses, nextGameTypes] = await Promise.all([
        listGotHouses(),
        listGotGameTypes(),
      ]);

      houses.value = nextHouses;
      gameTypes.value = nextGameTypes;
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  function houseName(id: string) {
    return housesById.value.get(id)?.name ?? id;
  }

  function gameTypeLabel(id: string) {
    return gameTypesById.value.get(id)?.label ?? id;
  }

  return {
    gameTypeLabel,
    gameTypes,
    gameTypesById,
    houseName,
    houses,
    housesById,
    load,
    loaded,
    loading,
  };
});
