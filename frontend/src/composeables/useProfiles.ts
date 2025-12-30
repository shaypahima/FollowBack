import { profileService } from '@/api/profileService';
import type { Profile } from '@/types';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';

const profiles = ref<Profile[]>([]);
const loading = ref(false);
const error = ref<Error | null>(null);

console.log("from getProfile: " + profiles.value);
const getProfiles = async () => {
  try {

    loading.value = true;
    const response = await profileService.getProfiles();
    profiles.value = response.profiles;
  } catch (err) {
    error.value = err as Error;
    ElMessage.error(error.value.message);
  } finally {
    loading.value = false;
  }
};

const uploadFile = async (file: File) => {
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
};

const updateProfiles = async (updatedProfiles: Profile[]) => {
  try {
    loading.value = true;
    const response = await profileService.updateProfiles(updatedProfiles);
    profiles.value = response.profiles;
    ElMessage.success('Profiles updated successfully!');
  } catch (err) {
    error.value = err as Error;
    ElMessage.error(error.value.message);
  } finally {
    loading.value = false;
  }
};

const useProfiles = () => {
  return { profiles, loading, error, getProfiles, uploadFile, updateProfiles };
};

export default useProfiles;
