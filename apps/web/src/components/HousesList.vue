<script setup lang="ts">
import { onMounted } from 'vue';

import HouseSigil from '@/components/HouseSigil.vue';
import { useHousesStore } from '@/stores/houses';

const housesStore = useHousesStore();

onMounted(() => {
  void housesStore.load();
});
</script>

<template>
  <v-list class="fill-height" density="comfortable" nav>
    <v-list-item
      v-for="house in housesStore.stats"
      :key="house.houseId"
      :subtitle="`игр: ${house.totalGames} ср. очки: ${house.averageScore.toFixed(1)}`"
      :title="house.name"
    >
      <template #prepend>
        <HouseSigil :house-id="house.houseId" />
      </template>
    </v-list-item>
  </v-list>
</template>
