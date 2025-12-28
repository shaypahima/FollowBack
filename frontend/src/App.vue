<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import '@fontsource/roboto'

const route = useRoute()
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <h2>Profile Manager</h2>
      <el-menu :default-active="route.path" mode="horizontal" router>
        <el-menu-item index="/">Profiles</el-menu-item>
        <el-menu-item index="/upload">Upload</el-menu-item>
      </el-menu>
    </el-header>

    <RouterView />
  </el-container>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color-base);
  padding: 0 var(--spacing-lg);
}

.app-header h2 {
  margin: 0;
  color: var(--text-primary);
}
</style>
