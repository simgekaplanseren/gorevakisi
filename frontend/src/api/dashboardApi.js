import api, { extractData } from './axios';

export const dashboardApi = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return extractData(res);
  },
  getNotifications: async () => {
    const res = await api.get('/dashboard/notifications');
    return extractData(res);
  },
};
