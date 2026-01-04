
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

  updateProfiles: async (profiles: Record<string,string>) => {
    console.log( "profiles: " + JSON.stringify(profiles));
    const response = await apiClient.post('/profiles/update-profiles', { updatedProfiles: profiles }, {
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    console.log(response.data);
    return response.data;
  },
};
