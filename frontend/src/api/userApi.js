import api, { extractData } from './axios';

export const userApi = {
  getAll: async () => {
    const res = await api.get('/users');
    return extractData(res);
  },
  create: async (data) => {
    const res = await api.post('/users', data);
    return extractData(res);
  },
  update: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return extractData(res);
  },
  delete: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return extractData(res);
  },
};
