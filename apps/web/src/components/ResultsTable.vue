<script setup lang="ts">
import type { GotResult } from '@got-stat/shared';

import { sortResultsByPlacement } from '@got-stat/shared';
import { computed } from 'vue';

import HouseSigil from '@/components/HouseSigil.vue';
import { usePlayersStore } from '@/stores/players';
import { useReferenceStore } from '@/stores/reference';

const props = defineProps<{
  results: GotResult[];
}>();

const playersStore = usePlayersStore();
const referenceStore = useReferenceStore();

const headers = [
  { align: 'center' as const, key: 'house', sortable: false, title: 'Дом' },
  { key: 'player', sortable: false, title: 'Игрок' },
  { align: 'center' as const, key: 'score', sortable: false, title: 'Очки' },
  {
    align: 'center' as const,
    key: 'landings',
    sortable: false,
    title: 'Территории',
  },
  {
    align: 'center' as const,
    key: 'supply',
    sortable: false,
    title: 'Снабжение',
  },
  { align: 'center' as const, key: 'throne', sortable: false, title: 'Трон' },
];

const items = computed(() =>
  sortResultsByPlacement(props.results).map((result) => ({
    ...result,
    houseName: referenceStore.houseName(result.houseId),
    playerName: playersStore.labelFor(result.playerId),
  })),
);
</script>

<template>
  <v-data-table
    class="results-table"
    :headers="headers"
    hide-default-footer
    :items="items"
    items-per-page="-1"
  >
    <template #item.house="{ item }">
      <div class="d-flex justify-center">
        <HouseSigil :house-id="item.houseId" />
      </div>
    </template>

    <template #item.player="{ item }">
      <span class="results-table__player">{{ item.playerName }}</span>
    </template>

    <template #item.score="{ item }">
      <span class="results-table__score">{{ item.score }}</span>
    </template>

    <template #item.landings="{ item }">
      <span class="results-table__score">{{ item.landings }}</span>
    </template>

    <template #item.supply="{ item }">
      <span class="results-table__score">{{ item.supply }}</span>
    </template>

    <template #item.throne="{ item }">
      <span class="results-table__score">{{ item.throne }}</span>
    </template>
  </v-data-table>
</template>

<style scoped>
.results-table__score {
  font-size: 1.75rem;
  font-weight: 500;
}

.results-table__player {
  font-size: 1.125rem;
  font-weight: 700;
}
</style>
