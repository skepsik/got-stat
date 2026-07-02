<script setup lang="ts">
import HousesList from '@/components/HousesList.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import PageIdLayout from '@/layouts/PageIdLayout.vue';
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <HousesList />
    </template>

    <PageIdLayout>
      <template #toolbar>
        <v-toolbar-title>Дома</v-toolbar-title>
      </template>

      <v-alert type="info" variant="tonal">
        Статистика по домам — в списке слева
      </v-alert>
    </PageIdLayout>
  </AppLayout>
</template>
