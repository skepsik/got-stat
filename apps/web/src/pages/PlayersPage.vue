<script setup lang="ts">
import type { LeaderboardRatingMode } from '@got-stat/shared';

import PlayersList from '@/components/PlayersList.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import PageIdLayout from '@/layouts/PageIdLayout.vue';
import { usePlayersStore } from '@/stores/players';

const playersStore = usePlayersStore();

const ratingOptions: Array<{
  title: string;
  value: LeaderboardRatingMode;
}> = [
  { title: 'Средние VP', value: 'average' },
  { title: 'ELO', value: 'elo' },
];
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <PlayersList />
    </template>

    <PageIdLayout>
      <template #toolbar>
        <v-toolbar-title>Игроки</v-toolbar-title>

        <v-spacer />

        <v-btn-toggle
          color="primary"
          density="comfortable"
          divided
          mandatory
          :model-value="playersStore.ratingMode"
          @update:model-value="playersStore.setRatingMode($event)"
        >
          <v-btn
            v-for="option in ratingOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.title }}
          </v-btn>
        </v-btn-toggle>
      </template>

      <v-alert type="info" variant="tonal">
        Рейтинг в списке слева:
        {{ playersStore.ratingMode === 'elo' ? 'ELO' : 'средние VP' }}
      </v-alert>
    </PageIdLayout>
  </AppLayout>
</template>
