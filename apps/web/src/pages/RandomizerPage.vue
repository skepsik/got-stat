<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import HouseSigil from '@/components/HouseSigil.vue';
import { usePlayersStore } from '@/stores/players';
import { useReferenceStore } from '@/stores/reference';
import { playerLabel, shuffle } from '@/utils/format';

const referenceStore = useReferenceStore();
const playersStore = usePlayersStore();

const gameTypeId = ref<null | string>(null);
const selectedPlayerIds = ref<string[]>([]);
const shuffledPlayerIds = ref<string[]>([]);

const gameType = computed(() =>
  gameTypeId.value
    ? referenceStore.gameTypesById.get(gameTypeId.value)
    : undefined,
);

const houses = computed(() => {
  if (!gameType.value) {
    return [];
  }

  return gameType.value.houseIds.map((houseId) => ({
    houseId,
    name: referenceStore.houseName(houseId),
  }));
});

const playerOptions = computed(() =>
  playersStore.players.map((player) => ({
    title: playerLabel(player.displayName, player.telegram),
    value: player.id,
  })),
);

const shuffledPlayers = computed(() =>
  shuffledPlayerIds.value.map((playerId) => {
    const player = playersStore.playersById.get(playerId);
    const stats = playersStore.leaderboard.find(
      (row) => row.playerId === playerId,
    );

    return {
      id: playerId,
      label: playerLabel(
        player?.displayName ?? stats?.displayName,
        player?.telegram,
      ),
    };
  }),
);

onMounted(async () => {
  await Promise.all([referenceStore.load(), playersStore.load()]);

  const firstType = referenceStore.gameTypes[0];

  if (firstType) {
    gameTypeId.value = firstType.id;
  }
});

function start() {
  shuffledPlayerIds.value = shuffle(selectedPlayerIds.value);
}
</script>

<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-app-bar flat>
      <v-toolbar-title>Рандомайзер</v-toolbar-title>
    </v-app-bar>

    <v-container fluid>
      <v-row align="center">
        <v-col cols="auto">Тип</v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="gameTypeId"
            hide-details
            item-title="label"
            item-value="id"
            :items="referenceStore.gameTypes"
          />
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="auto">Игроки</v-col>

        <v-col cols="12" md="8">
          <v-select
            v-model="selectedPlayerIds"
            hide-details
            :items="playerOptions"
            multiple
          />
        </v-col>
      </v-row>

      <v-btn class="mt-4" color="primary" @click="start">Старт!</v-btn>

      <v-list v-if="shuffledPlayers.length > 0" class="mt-6" lines="two">
        <v-list-item
          v-for="(house, index) in houses"
          :key="house.houseId"
          :subtitle="shuffledPlayers[index]?.label ?? '—'"
          :title="house.name"
        >
          <template #prepend>
            <HouseSigil :house-id="house.houseId" />
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </div>
</template>
