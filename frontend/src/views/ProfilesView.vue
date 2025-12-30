<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProfileList from '@/components/ProfileList.vue'
import { useProfileStore } from '@/store/profile'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useProfileStore()
const { profiles, loading } = storeToRefs(store)
const { getProfiles } = store

onMounted(async () => {
  console.log({ loading })
  await getProfiles()

  if (profiles.value.length === 0) {
    router.push('/upload')
  }
})

watch(profiles, (newProfiles) => {
  console.log({ newProfiles })

  if (newProfiles.length === 0 && router.currentRoute.value.path === '/') {
    router.push('/upload')
  }
})
</script>

<template>
  <el-main>
    <el-container class="center">
      <el-card v-if="loading" class="loading-card">
        <el-skeleton :rows="5" animated />
      </el-card>
      <ProfileList v-else :profiles="profiles" />
    </el-container>
  </el-main>
</template>

<style scoped>
.center {
  justify-content: center;
}

.loading-card {
  max-width: 1200px;
  width: 100%;
}
</style>
