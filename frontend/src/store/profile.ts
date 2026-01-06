import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Profile } from '@/types'
import { profileService } from '@/api/profileService'

export const useProfileStore = defineStore('profile', () => {
  const profiles = ref<Profile[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function getProfiles() {
    try {
      loading.value = true
      const response = await profileService.getProfiles()
      if(!response.profiles) throw new Error("no profiles")
      profiles.value = response.profiles
    } catch (err) {
      error.value = err as Error
      ElMessage.error(error.value.message)
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(file: File) {
    try {
      loading.value = true;
      const response = await profileService.uploadZipFile(file);
      profiles.value = response.profiles;
      ElMessage.success('File uploaded successfully!');
    } catch (err) {
      error.value = err as Error;
      ElMessage.error(error.value.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfiles(updatedProfiles: Record<string,string | null>) {
    try {
      loading.value = true
      const response = await profileService.updateProfiles(updatedProfiles)
      if (response.profiles && Array.isArray(response.profiles)) {
        profiles.value = response.profiles
      }
      ElMessage.success('Profiles updated successfully!')
    } catch (err) {
      error.value = err as Error
      ElMessage.error(error.value.message)
    } finally {
      loading.value = false
    }
  }

  return {
    profiles,
    loading,
    error,
    getProfiles,
    updateProfiles,
    uploadFile,
  }
})
