import { api } from './client';

const qs = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  return usp.toString();
};

export const appsApi = {
  list: ({ page = 1, limit = 20, status, category, q, sortBy = 'newest' } = {}) =>
    api.get(`/admin/apps?${qs({ page, limit, status, category, q, sortBy })}`),

  detail: (id) => api.get(`/admin/apps/${id}`),

  approve: (id, payload = {}) => api.patch(`/admin/apps/${id}/approve`, payload),
  reject: (id, reason) => api.patch(`/admin/apps/${id}/reject`, { reason }),
  suspend: (id, reason) => api.patch(`/admin/apps/${id}/suspend`, { reason }),
  restore: (id) => api.patch(`/admin/apps/${id}/restore`, {}),
  setCategory: (id, category) => api.patch(`/admin/apps/${id}/category`, { category }),
  setVerified: (id, isVerified) => api.patch(`/admin/apps/${id}/verify`, { isVerified }),
  remove: (id) => api.delete(`/admin/apps/${id}`),
};

export const CATEGORIES = [
  'games', 'finance', 'social', 'productivity', 'shopping',
  'education', 'entertainment', 'utilities', 'other'
];
