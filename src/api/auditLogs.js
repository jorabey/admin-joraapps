import { api } from './client';

const qs = (params) => {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, v);
  });
  return usp.toString();
};

export const auditLogsApi = {
  list: ({ page = 1, limit = 30, action, targetType, adminId } = {}) =>
    api.get(`/admin/audit-logs?${qs({ page, limit, action, targetType, adminId })}`),

  targetHistory: (targetType, targetId) =>
    api.get(`/admin/audit-logs/${targetType}/${targetId}`),
};
