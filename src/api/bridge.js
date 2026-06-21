import { api } from './client';

export const bridgeApi = {
  overview: () => api.get('/admin/bridge/overview'),
  status: (appId) => api.get(`/admin/bridge/${appId}`),
  close: (appId, reason) => api.patch(`/admin/bridge/${appId}/close`, { reason }),
  reopen: (appId) => api.patch(`/admin/bridge/${appId}/reopen`, {}),
  flushCache: (appId) => api.post(`/admin/bridge/${appId}/flush-cache`, {}),
};
