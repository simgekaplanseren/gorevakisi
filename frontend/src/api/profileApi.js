import api, { extractData } from './axios';

export const profileApi = {
  get: async () => {
    const res = await api.get('/profile');
    return extractData(res);
  },
  update: async (data) => {
    const res = await api.put('/profile', data);
    return extractData(res);
  },
  changePassword: async (data) => {
    const res = await api.put('/profile/password', data);
    return extractData(res);
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractData(res);
  },
};
