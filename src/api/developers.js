import { api } from './client';

const qs = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  return usp.toString();
};

export const developersApi = {
  list: ({ page = 1, limit = 20, status, q } = {}) =>
    api.get(`/admin/developers?${qs({ page, limit, status, q })}`),

  detail: (id) => api.get(`/admin/developers/${id}`),

  approve: (id) => api.patch(`/admin/developers/${id}/approve`, {}),
  suspend: (id, reason) => api.patch(`/admin/developers/${id}/suspend`, { reason }),
  reactivate: (id) => api.patch(`/admin/developers/${id}/reactivate`, {}),
};
