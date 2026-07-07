import api, { extractData } from './axios';

export const taskApi = {
  getAll: async (params) => {
    const res = await api.get('/tasks', { params });
    return extractData(res);
  },
  getById: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return extractData(res);
  },
  create: async (data) => {
    const res = await api.post('/tasks', data);
    return extractData(res);
  },
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return extractData(res);
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    return extractData(res);
  },
  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return extractData(res);
  },
};
