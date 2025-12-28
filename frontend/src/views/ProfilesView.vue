<script setup lang="ts">
import DUMMY_PROFILES from '@/dummyProfiles'
import ProfileList from '@/components/ProfileList.vue'
</script>

<template>
  <el-main>
    <el-container class="center" >
      <ProfileList :profiles="DUMMY_PROFILES" />
    </el-container>
  </el-main>
</template>

<style scoped>
  .center {
    justify-content: center;
  }
</style>
