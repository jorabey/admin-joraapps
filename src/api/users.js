import { api } from './client';

const qs = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  return usp.toString();
};

export const usersApi = {
  list: ({ page = 1, limit = 20, blocked, q } = {}) =>
    api.get(`/admin/users?${qs({ page, limit, blocked, q })}`),

  detail: (id) => api.get(`/admin/users/${id}`),

  block: (id, reason) => api.patch(`/admin/users/${id}/block`, { reason }),
  unblock: (id) => api.patch(`/admin/users/${id}/unblock`, {}),
  forceLogout: (id) => api.post(`/admin/users/${id}/force-logout`, {}),
};
