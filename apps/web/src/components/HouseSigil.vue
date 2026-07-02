<script setup lang="ts">
import { computed } from 'vue';

import { houseColor } from '@/utils/houses';
import { getSigilFromId } from '@/utils/sigils';

const props = defineProps<{
  houseId: string;
  size?: number;
}>();

const src = computed(() => getSigilFromId(props.houseId));
const size = computed(() => props.size ?? 40);
</script>

<template>
  <v-avatar v-if="src" :size="size">
    <v-img :alt="props.houseId" cover :src="src" />
  </v-avatar>

  <v-avatar v-else :color="houseColor(props.houseId)" :size="size">
    <v-icon color="white" icon="mdi-castle" />
  </v-avatar>
</template>
