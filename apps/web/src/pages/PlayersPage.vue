<script setup lang="ts">
import PlayersList from '@/components/PlayersList.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import PageIdLayout from '@/layouts/PageIdLayout.vue';
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <PlayersList />
    </template>

    <PageIdLayout>
      <template #toolbar>
        <v-toolbar-title>Игроки</v-toolbar-title>
      </template>

      <v-alert type="info" variant="tonal">
        Выбери игрока в списке слева
      </v-alert>
    </PageIdLayout>
  </AppLayout>
</template>
