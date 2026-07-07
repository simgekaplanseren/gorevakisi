import api, { extractData, extractError } from './axios';

export const authApi = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return extractData(res);
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return extractData(res);
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return extractData(res);
  },
  me: async () => {
    const res = await api.get('/auth/me');
    return extractData(res);
  },
};

export { extractError };
