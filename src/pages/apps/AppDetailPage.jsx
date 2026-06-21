import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, Badge, Divider, EmptyState } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { Modal } from '../../components/ui/Modal';
import { OrbitLoader } from '../../components/ui/OrbitMark';
import {
  IconStar, IconCheckCircle, IconFlag, IconExternal, IconTrash,
  IconChevronLeft, IconActivity, IconClock,
} from '../../components/ui/icons';
import { appsApi, CATEGORIES } from '../../api/apps';
import { auditLogsApi } from '../../api/auditLogs';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import './app-detail.css';

const statusVariant = (status) => (
  status === 'live' ? 'live' : status === 'under_review' ? 'review' : 'suspended'
);

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AppDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useLang();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [modal, setModal] = useState(null); // approve | reject | suspend | restore | delete | category
  const [categoryDraft, setCategoryDraft] = useState('other');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appsApi.detail(id);
      setData(res.data);
      setCategoryDraft(res.data.app.category);
    } catch (err) {
      showToast(err?.message || 'Error loading app', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    auditLogsApi.targetHistory('App', id).then((res) => setLogs(res.data?.logs || [])).catch(() => {});
  }, [id]);

  const app = data?.app;

  const handleApprove = async () => {
    await appsApi.approve(id, {});
    showToast('App approved and live.', 'success');
    setModal(null);
    load();
  };

  const handleReject = async (reason) => {
    await appsApi.reject(id, reason);
    showToast('App rejected.', 'default');
    setModal(null);
    load();
  };

  const handleSuspend = async (reason) => {
    await appsApi.suspend(id, reason);
    showToast('App suspended. Bridge API access closed.', 'warn');
    setModal(null);
    load();
  };

  const handleRestore = async () => {
    await appsApi.restore(id);
    showToast('App restored and live.', 'success');
    setModal(null);
    load();
  };

  const handleVerifyToggle = async () => {
    await appsApi.setVerified(id, !app.isVerified);
    showToast(app.isVerified ? 'Verification removed.' : 'App verified.', 'success');
    load();
  };

  const handleDelete = async () => {
    await appsApi.remove(id);
    showToast('App permanently deleted.', 'default');
    navigate('/apps');
  };

  const handleCategorySave = async () => {
    await appsApi.setCategory(id, categoryDraft);
    showToast(t('saved'), 'success');
    setModal(null);
    load();
  };

  if (loading) {
    return (
      <div className="app-detail-page">
        <PageHeader title="" />
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><OrbitLoader /></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="app-detail-page">
        <PageHeader title="404" />
        <EmptyState title="App not found" />
      </div>
    );
  }

  return (
    <div className="app-detail-page">
      <PageHeader title={app.name} />

      <div className="app-detail-page__inner">
        <button className="app-detail-back" onClick={() => navigate('/apps')}>
          <IconChevronLeft width={15} height={15} /> {t('back_to_apps') || t('apps_title')}
        </button>

        {/* Hero */}
        <div className="app-detail-hero">
          {app.iconUrl ? <img src={app.iconUrl} alt="" className="app-detail-hero__icon" /> : (
            <div className="app-detail-hero__icon app-detail-hero__icon--ph">{app.name?.[0]}</div>
          )}
          <div className="app-detail-hero__info">
            <div className="app-detail-hero__name-row">
              <h1 className="app-detail-hero__name display">{app.name}</h1>
              <Badge variant={statusVariant(app.status)} dot={app.status === 'live'}>{t(`status_${app.status}`)}</Badge>
              {app.isVerified && <Badge variant="info"><IconCheckCircle width={12} height={12} />{t('verified_badge')}</Badge>}
            </div>
            <p className="app-detail-hero__username mono">@{app.username} · {app.developerId?.companyName || app.developerId?.fullName}</p>
          </div>
          <div className="app-detail-hero__actions">
            {app.appUrl && (
              <Button as="a" href={app.appUrl} target="_blank" rel="noreferrer" variant="ghost" size="sm" icon={<IconExternal width={14} height={14} />}>
                {t('action_view')}
              </Button>
            )}
          </div>
        </div>

        {/* Moderation action bar */}
        <Card className="app-detail-action-bar">
          {app.status === 'under_review' && (
            <>
              <Button variant="success" size="sm" onClick={() => setModal('approve')}>{t('action_approve')}</Button>
              <Button variant="danger" size="sm" onClick={() => setModal('reject')}>{t('action_reject')}</Button>
            </>
          )}
          {app.status === 'live' && (
            <Button variant="danger" size="sm" onClick={() => setModal('suspend')}>{t('action_suspend')}</Button>
          )}
          {app.status === 'suspended' && (
            <Button variant="success" size="sm" onClick={() => setModal('restore')}>{t('action_restore')}</Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleVerifyToggle}>
            {app.isVerified ? t('action_unverify') : t('action_verify')}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModal('category')}>{t('category_label')}</Button>
          <Button variant="danger" size="sm" icon={<IconTrash width={14} height={14} />} onClick={() => setModal('delete')}>
            {t('action_delete')}
          </Button>
        </Card>

        {/* Stat grid */}
        <Card className="stat-grid">
          <div className="stat-cell">
            <span className="stat-cell__icon stat-cell__icon--blue"><IconActivity width={18} height={18} /></span>
            <div>
              <p className="stat-cell__value">{(app.stats?.totalConnections || 0).toLocaleString()}</p>
              <p className="stat-cell__label">Total connections</p>
            </div>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__icon stat-cell__icon--green"><IconActivity width={18} height={18} /></span>
            <div>
              <p className="stat-cell__value">{data.activeConnections}</p>
              <p className="stat-cell__label">{t('app_active_connections')}</p>
            </div>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__icon stat-cell__icon--amber"><IconStar width={18} height={18} /></span>
            <div>
              <p className="stat-cell__value">{app.rating?.average?.toFixed(1) || '—'}</p>
              <p className="stat-cell__label">Rating ({app.rating?.count || 0})</p>
            </div>
          </div>
          <div className="stat-cell">
            <span className="stat-cell__icon stat-cell__icon--violet"><IconFlag width={18} height={18} /></span>
            <div>
              <p className="stat-cell__value">{data.reportsCount}</p>
              <p className="stat-cell__label">{t('app_reports_count')}</p>
            </div>
          </div>
        </Card>

        {/* Info card */}
        <Card className="info-card">
          <div className="info-row"><span className="info-row__label">{t('col_category')}</span><span className="info-row__value">{t(`cat_${app.category}`)}</span></div>
          <Divider />
          <div className="info-row"><span className="info-row__label">{t('created')}</span><span className="info-row__value">{new Date(app.createdAt).toLocaleString()}</span></div>
          {app.moderation?.suspendedReason && (
            <>
              <Divider />
              <div className="info-row"><span className="info-row__label">{t('suspended_reason_label')}</span><span className="info-row__value">{app.moderation.suspendedReason}</span></div>
            </>
          )}
          {app.moderation?.rejectedReason && (
            <>
              <Divider />
              <div className="info-row"><span className="info-row__label">{t('rejected_reason_label')}</span><span className="info-row__value">{app.moderation.rejectedReason}</span></div>
            </>
          )}
        </Card>

        {/* Description */}
        {app.description && (
          <Card className="desc-card">
            <p>{app.description}</p>
          </Card>
        )}

        {/* Recent reports on this app */}
        {data.recentReports?.length > 0 && (
          <Card className="info-card">
            <p className="app-detail-hero__username" style={{ marginBottom: 8 }}>{t('reports_title')}</p>
            {data.recentReports.map((r, i) => (
              <div key={r._id}>
                {i > 0 && <Divider />}
                <div className="info-row">
                  <span className="info-row__label">{t(`reason_${r.reason}`)} · @{r.reporterId?.username}</span>
                  <Badge variant={r.status === 'pending' ? 'review' : r.status === 'resolved' ? 'live' : 'neutral'}>{t(`status_${r.status}`)}</Badge>
                </div>
              </div>
            ))}
          </Card>
        )}

        {/* Moderation history */}
        {logs.length > 0 && (
          <Card className="info-card">
            <p className="app-detail-hero__username" style={{ marginBottom: 8 }}>{t('moderation_history')}</p>
            {logs.map((log, i) => (
              <div key={log._id}>
                {i > 0 && <Divider />}
                <div className="info-row">
                  <span className="info-row__value" style={{ textAlign: 'left' }}>{log.description}</span>
                  <span className="info-row__label" style={{ flexShrink: 0 }}>
                    <IconClock width={11} height={11} style={{ display: 'inline', marginRight: 4 }} />
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Modals */}
      <ConfirmActionModal
        open={modal === 'approve'}
        onClose={() => setModal(null)}
        onConfirm={handleApprove}
        title={t('approve_title')}
        description={t('approve_desc')}
        confirmLabel={t('action_approve')}
        cancelLabel={t('cancel')}
        variant="primary"
      />
      <ConfirmActionModal
        open={modal === 'reject'}
        onClose={() => setModal(null)}
        onConfirm={handleReject}
        title={t('reject_title')}
        description={t('reject_desc')}
        confirmLabel={t('action_reject')}
        cancelLabel={t('cancel')}
        requireReason
        reasonLabel={t('reason_label')}
        reasonPlaceholder={t('reason_placeholder')}
      />
      <ConfirmActionModal
        open={modal === 'suspend'}
        onClose={() => setModal(null)}
        onConfirm={handleSuspend}
        title={t('suspend_title')}
        description={t('suspend_desc')}
        confirmLabel={t('action_suspend')}
        cancelLabel={t('cancel')}
        requireReason
        reasonLabel={t('reason_label')}
        reasonPlaceholder={t('reason_placeholder')}
      />
      <ConfirmActionModal
        open={modal === 'restore'}
        onClose={() => setModal(null)}
        onConfirm={handleRestore}
        title={t('restore_title')}
        description={t('restore_desc')}
        confirmLabel={t('action_restore')}
        cancelLabel={t('cancel')}
        variant="primary"
      />
      <ConfirmActionModal
        open={modal === 'delete'}
        onClose={() => setModal(null)}
        onConfirm={handleDelete}
        title={t('delete_app_title')}
        description={t('delete_app_desc')}
        confirmLabel={t('action_delete')}
        cancelLabel={t('cancel')}
      />

      <Modal open={modal === 'category'} onClose={() => setModal(null)} title={t('category_label')}>
        <div className="category-picker">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`category-chip ${categoryDraft === c ? 'is-active' : ''}`}
              onClick={() => setCategoryDraft(c)}
            >
              {t(`cat_${c}`)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Button variant="secondary" fullWidth onClick={() => setModal(null)}>{t('cancel')}</Button>
          <Button fullWidth onClick={handleCategorySave}>{t('save')}</Button>
        </div>
      </Modal>
    </div>
  );
}
