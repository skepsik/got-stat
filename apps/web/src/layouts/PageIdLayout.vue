<template>
  <div class="d-flex flex-column flex-grow-1 min-h-0">
    <v-app-bar flat>
      <slot name="toolbar" />
    </v-app-bar>

    <v-container class="flex-grow-1" fluid>
      <slot />
    </v-container>
  </div>
</template>
