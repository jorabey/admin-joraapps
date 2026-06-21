import { api } from './client';

export const dashboardApi = {
  overview: () => api.get('/admin/dashboard/overview'),
  activity: (limit = 20) => api.get(`/admin/dashboard/activity?limit=${limit}`),
  growth: (days = 14) => api.get(`/admin/dashboard/growth?days=${days}`),
};
