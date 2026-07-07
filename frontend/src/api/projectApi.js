import api, { extractData } from './axios';

export const projectApi = {
  getAll: async (search) => {
    const res = await api.get('/projects', { params: { search } });
    return extractData(res);
  },
  getById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return extractData(res);
  },
  create: async (data) => {
    const res = await api.post('/projects', data);
    return extractData(res);
  },
  update: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return extractData(res);
  },
  delete: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return extractData(res);
  },
  addMember: async (projectId, userId) => {
    const res = await api.post(`/projects/${projectId}/members`, { userId });
    return extractData(res);
  },
  removeMember: async (projectId, userId) => {
    const res = await api.delete(`/projects/${projectId}/members/${userId}`);
    return extractData(res);
  },
};
