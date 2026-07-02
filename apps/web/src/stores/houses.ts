import type { GotHouseStats } from '@got-stat/shared';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { getGotHouseStats } from '@/api/got';

export const useHousesStore = defineStore('houses', () => {
  const stats = ref<GotHouseStats[]>([]);
  const loading = ref(false);
  const loaded = ref(false);

  async function load() {
    if (loaded.value || loading.value) {
      return;
    }

    loading.value = true;

    try {
      stats.value = await getGotHouseStats();
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    loaded,
    loading,
    stats,
  };
});
