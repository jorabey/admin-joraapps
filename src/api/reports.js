import { api } from './client';

const qs = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  return usp.toString();
};

export const reportsApi = {
  list: ({ page = 1, limit = 20, status, reason, appId } = {}) =>
    api.get(`/admin/reports?${qs({ page, limit, status, reason, appId })}`),

  detail: (id) => api.get(`/admin/reports/${id}`),

  investigate: (id) => api.patch(`/admin/reports/${id}/investigate`, {}),
  resolve: (id, adminComment) => api.patch(`/admin/reports/${id}/resolve`, { adminComment }),
  reject: (id, adminComment) => api.patch(`/admin/reports/${id}/reject`, { adminComment }),
  setStatus: (id, status, adminComment) => api.patch(`/admin/reports/${id}/status`, { status, adminComment }),
};

export const REPORT_REASONS = ['spam', 'inappropriate', 'malware', 'copyright', 'fake_app', 'other'];
export const REPORT_STATUSES = ['pending', 'investigating', 'resolved', 'rejected'];
