import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toolbar, SelectFilter } from '../../components/ui/Toolbar';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Primitives';
import { auditLogsApi } from '../../api/auditLogs';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import '../apps/apps-list.css';

const TARGET_TYPES = ['App', 'Developer', 'User', 'AppReport', 'Admin', 'Bridge'];

const targetVariant = (type) => ({
  App: 'info', Developer: 'violet', User: 'neutral', AppReport: 'review', Admin: 'silver', Bridge: 'suspended',
}[type] || 'neutral');

export default function AuditLogPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [targetType, setTargetType] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await auditLogsApi.list({ page, limit: 30, targetType: targetType === 'all' ? undefined : targetType });
      setRows(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, targetType, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [targetType]);

  const columns = [
    { key: 'adminEmail', label: t('col_admin'), render: (row) => <span className="apps-cell-muted">{row.adminEmail}</span> },
    { key: 'action', label: t('col_action'), render: (row) => <span className="mono apps-cell-muted">{row.action}</span> },
    { key: 'targetType', label: t('col_target'), render: (row) => <Badge variant={targetVariant(row.targetType)}>{row.targetType}</Badge> },
    { key: 'description', label: t('col_description'), render: (row) => <span style={{ fontSize: 13 }}>{row.description}</span> },
    { key: 'createdAt', label: t('col_when'), render: (row) => <span className="apps-cell-muted">{new Date(row.createdAt).toLocaleString()}</span> },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader title={t('audit_title')} subtitle={t('audit_subtitle')} />

      <Toolbar
        filters={
          <SelectFilter
            value={targetType}
            onChange={setTargetType}
            options={[{ value: 'all', label: t('status_all') }, ...TARGET_TYPES.map((tt) => ({ value: tt, label: tt }))]}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-mobile-card__meta">
              <Badge variant={targetVariant(row.targetType)}>{row.targetType}</Badge>
              <span className="apps-cell-muted mono" style={{ fontSize: 11.5 }}>{row.action}</span>
            </div>
            <p style={{ fontSize: 13, margin: '6px 0 2px' }}>{row.description}</p>
            <p className="apps-cell-muted" style={{ fontSize: 11 }}>{row.adminEmail} · {new Date(row.createdAt).toLocaleString()}</p>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
