<template>
  <v-container class="fill-height d-flex flex-column justify-center" max-width="1100">
    <div>
      <div class="mb-8 text-center">
        <div class="text-body-medium font-weight-light mb-n1">Welcome to</div>
        <div class="text-display-medium font-weight-bold">GoT Stat</div>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            rounded="lg"
            variant="tonal"
          >
            <template #prepend>
              <v-avatar class="ml-2 mr-4" icon="mdi-rocket-launch-outline" size="60" variant="tonal" />
            </template>

            <template #title>
              <div class="my-title my-uppercase text-headline-medium font-weight-bold">Scaffold ready</div>
            </template>

            <template #subtitle>
              <div class="text-body-large">
                Monorepo: <v-kbd>apps/web</v-kbd> + <v-kbd>apps/api</v-kbd>
              </div>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
</script>
