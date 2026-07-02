<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ResultsTable from '@/components/ResultsTable.vue';
import PageIdLayout from '@/layouts/PageIdLayout.vue';
import { useGamesStore } from '@/stores/games';
import { usePlayersStore } from '@/stores/players';
import { useReferenceStore } from '@/stores/reference';
import { formatGameDate } from '@/utils/format';

const route = useRoute();
const gamesStore = useGamesStore();
const playersStore = usePlayersStore();
const referenceStore = useReferenceStore();

const gameId = computed(() => String(route.params.id));

const game = computed(() => gamesStore.getById(gameId.value));

const title = computed(() =>
  game.value ? referenceStore.gameTypeLabel(game.value.gameTypeId) : '',
);

const date = computed(() =>
  game.value ? formatGameDate(game.value.playedAt) : '',
);

onMounted(() => {
  void Promise.all([
    gamesStore.load(),
    playersStore.load(),
    referenceStore.load(),
  ]);
});
</script>

<template>
  <PageIdLayout>
    <template #toolbar>
      <v-toolbar-title>GoT — {{ title }}</v-toolbar-title>
      <v-spacer />
      <span>{{ date }}</span>
    </template>

    <ResultsTable v-if="game" :results="game.results" />

    <v-alert v-else type="info" variant="tonal">
      Партия не найдена
    </v-alert>
  </PageIdLayout>
</template>
