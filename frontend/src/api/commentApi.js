import api, { extractData } from './axios';

export const commentApi = {
  getByTask: async (taskId) => {
    const res = await api.get(`/tasks/${taskId}/comments`);
    return extractData(res);
  },
  create: async (taskId, comment) => {
    const res = await api.post(`/tasks/${taskId}/comments`, { comment });
    return extractData(res);
  },
};
