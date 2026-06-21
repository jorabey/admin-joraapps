import { api, setAccessToken } from './client';

export const authApi = {
  login: (email, password) =>
    api.post('/admin/auth/login', { email, password }, { skipAuth: true }).then((data) => {
      setAccessToken(data.accessToken);
      return data;
    }),

  logout: () => api.post('/admin/auth/logout', {}).finally(() => setAccessToken(null)),

  getMe: () => api.get('/admin/auth/me'),

  changePassword: (oldPassword, newPassword) =>
    api.put('/admin/auth/password', { oldPassword, newPassword }),

  listAdmins: () => api.get('/admin/auth/admins'),

  createAdmin: (payload) => api.post('/admin/auth/admins', payload),

  setAdminStatus: (id, status) => api.patch(`/admin/auth/admins/${id}/status`, { status }),
};
