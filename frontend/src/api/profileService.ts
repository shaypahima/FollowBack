import type { Profile } from "@/types";
import { apiClient } from "./apiClient";

export const profileService = {
  getProfiles: async () => {

    const response = await apiClient.get('/profiles/all');


    return response.data;
  },

  uploadZipFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/profiles/upload-zip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { profiles: response.data.data || response.data.profiles || [] };
  },

  updateProfiles: async (profiles: Profile[]) => {
    const response = await apiClient.post('/profiles/update-profiles', { profiles });
    return response.data;
  },
};
