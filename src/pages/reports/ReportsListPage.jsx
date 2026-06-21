import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toolbar, SelectFilter } from '../../components/ui/Toolbar';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Primitives';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { reportsApi, REPORT_REASONS, REPORT_STATUSES } from '../../api/reports';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import '../apps/apps-list.css';

const statusVariant = (status) => (
  status === 'resolved' ? 'live' : status === 'pending' ? 'review' : status === 'investigating' ? 'info' : 'neutral'
);

export default function ReportsListPage() {
  const { t } = useLang();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [reason, setReason] = useState('all');

  const [selected, setSelected] = useState(null);
  const [actionModal, setActionModal] = useState(null); // resolve | reject

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportsApi.list({ page, limit: 20, status, reason });
      setRows(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, reason, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [status, reason]);

  const openDetail = async (row) => {
    setSelected(row);
    try {
      const res = await reportsApi.investigate(row._id);
      // Only auto-move pending -> investigating; don't disturb resolved/rejected
      if (row.status === 'pending') {
        setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, status: 'investigating' } : r)));
      }
    } catch { /* ignore if already not pending */ }
  };

  const handleResolve = async (comment) => {
    await reportsApi.resolve(selected._id, comment || '');
    showToast('Report resolved.', 'success');
    setActionModal(null);
    setSelected(null);
    load();
  };

  const handleReject = async (comment) => {
    await reportsApi.reject(selected._id, comment);
    showToast('Report rejected.', 'default');
    setActionModal(null);
    setSelected(null);
    load();
  };

  const columns = [
    {
      key: 'appId', label: t('col_app_reported'),
      render: (row) => (
        <div className="apps-cell-app">
          {row.appId?.iconUrl ? <img src={row.appId.iconUrl} alt="" /> : <span className="apps-cell-app__ph">{row.appId?.name?.[0] || '?'}</span>}
          <div>
            <span className="apps-cell-app__name">{row.appId?.name || 'Deleted app'}</span>
            <span className="apps-cell-app__username">@{row.appId?.username}</span>
          </div>
        </div>
      ),
    },
    { key: 'reporterId', label: t('col_reporter'), render: (row) => <span className="apps-cell-muted">@{row.reporterId?.username}</span> },
    { key: 'reason', label: t('col_reason'), render: (row) => <Badge variant="neutral">{t(`reason_${row.reason}`)}</Badge> },
    { key: 'status', label: t('col_status'), render: (row) => <Badge variant={statusVariant(row.status)} dot={row.status === 'pending'}>{t(`status_${row.status}`)}</Badge> },
    { key: 'createdAt', label: t('created'), render: (row) => <span className="apps-cell-muted">{new Date(row.createdAt).toLocaleDateString()}</span> },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader title={t('reports_title')} subtitle={t('reports_subtitle')} />

      <Toolbar
        filters={
          <>
            <SelectFilter
              value={status}
              onChange={setStatus}
              options={[{ value: 'all', label: t('status_all') }, ...REPORT_STATUSES.map((s) => ({ value: s, label: t(`status_${s}`) }))]}
            />
            <SelectFilter
              value={reason}
              onChange={setReason}
              options={[{ value: 'all', label: t('status_all') }, ...REPORT_REASONS.map((r) => ({ value: r, label: t(`reason_${r}`) }))]}
            />
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        onRowClick={openDetail}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-cell-app">
              {row.appId?.iconUrl ? <img src={row.appId.iconUrl} alt="" /> : <span className="apps-cell-app__ph">{row.appId?.name?.[0] || '?'}</span>}
              <div>
                <span className="apps-cell-app__name">{row.appId?.name || 'Deleted app'}</span>
                <span className="apps-cell-app__username">@{row.reporterId?.username}</span>
              </div>
            </div>
            <div className="apps-mobile-card__meta">
              <Badge variant="neutral">{t(`reason_${row.reason}`)}</Badge>
              <Badge variant={statusVariant(row.status)} dot={row.status === 'pending'}>{t(`status_${row.status}`)}</Badge>
            </div>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Detail modal */}
      <Modal
        open={!!selected && !actionModal}
        onClose={() => setSelected(null)}
        title={selected?.appId?.name || 'Report'}
        size="lg"
        footer={
          selected && selected.status !== 'resolved' && selected.status !== 'rejected' && (
            <>
              <Button variant="secondary" fullWidth onClick={() => setActionModal('reject')}>{t('action_reject_report')}</Button>
              <Button variant="success" fullWidth onClick={() => setActionModal('resolve')}>{t('action_resolve')}</Button>
            </>
          )
        }
      >
        {selected && (
          <div className="report-detail">
            <div className="report-detail__row"><span>{t('col_reporter')}</span><strong>@{selected.reporterId?.username}</strong></div>
            <div className="report-detail__row"><span>{t('col_reason')}</span><Badge variant="neutral">{t(`reason_${selected.reason}`)}</Badge></div>
            <div className="report-detail__row"><span>{t('col_status')}</span><Badge variant={statusVariant(selected.status)}>{t(`status_${selected.status}`)}</Badge></div>
            <div className="report-detail__desc">
              <p className="report-detail__desc-label">{t('reason_placeholder')}</p>
              <p className="report-detail__desc-text">{selected.description}</p>
            </div>
            {selected.adminComment && (
              <div className="report-detail__desc">
                <p className="report-detail__desc-label">{t('admin_comment_label')}</p>
                <p className="report-detail__desc-text">{selected.adminComment}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmActionModal
        open={actionModal === 'resolve'}
        onClose={() => setActionModal(null)}
        onConfirm={handleResolve}
        title={t('resolve_title')}
        description={t('resolve_desc')}
        confirmLabel={t('action_resolve')}
        cancelLabel={t('cancel')}
        variant="primary"
        showOptionalReason
        reasonLabel={t('admin_comment_label')}
        reasonPlaceholder={t('admin_comment_placeholder')}
      />
      <ConfirmActionModal
        open={actionModal === 'reject'}
        onClose={() => setActionModal(null)}
        onConfirm={handleReject}
        title={t('reject_report_title')}
        description={t('reject_report_desc')}
        confirmLabel={t('action_reject_report')}
        cancelLabel={t('cancel')}
        requireReason
        reasonLabel={t('admin_comment_label')}
        reasonPlaceholder={t('admin_comment_placeholder')}
      />
    </div>
  );
}
