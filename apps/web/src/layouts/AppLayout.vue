<template>
  <div class="d-flex fill-height">
    <div class="app-layout__sidebar">
      <slot name="sidebar" />
    </div>

    <v-divider vertical />

    <div class="d-flex flex-column flex-grow-1 min-w-0">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-layout__sidebar {
  flex: 0 0 300px;
  max-width: 300px;
  z-index: 1;
}
</style>
