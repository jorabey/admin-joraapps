import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, Badge, Divider, EmptyState } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { OrbitLoader } from '../../components/ui/OrbitMark';
import { IconChevronLeft, IconExternal, IconMail, IconBuilding, IconGlobe, IconStar } from '../../components/ui/icons';
import { developersApi } from '../../api/developers';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import '../apps/app-detail.css';

const statusVariant = (status) => (
  status === 'active' ? 'live' : status === 'pending_review' ? 'review' : 'suspended'
);

export default function DeveloperDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useLang();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await developersApi.detail(id);
      setData(res.data);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { load(); }, [load]);

  const dev = data?.developer;

  const handleApprove = async () => {
    await developersApi.approve(id);
    showToast('Developer approved.', 'success');
    setModal(null);
    load();
  };
  const handleSuspend = async (reason) => {
    await developersApi.suspend(id, reason);
    showToast('Developer suspended. Sessions revoked.', 'warn');
    setModal(null);
    load();
  };
  const handleReactivate = async () => {
    await developersApi.reactivate(id);
    showToast('Developer reactivated.', 'success');
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

  if (!dev) {
    return <div className="app-detail-page"><PageHeader title="404" /><EmptyState title="Developer not found" /></div>;
  }

  return (
    <div className="app-detail-page">
      <PageHeader title={dev.fullName} />
      <div className="app-detail-page__inner">
        <button className="app-detail-back" onClick={() => navigate('/developers')}>
          <IconChevronLeft width={15} height={15} /> {t('dev_title')}
        </button>

        <div className="app-detail-hero">
          <div className="app-detail-hero__icon app-detail-hero__icon--ph">{dev.fullName?.[0]}</div>
          <div className="app-detail-hero__info">
            <div className="app-detail-hero__name-row">
              <h1 className="app-detail-hero__name display">{dev.fullName}</h1>
              <Badge variant={statusVariant(dev.status)} dot={dev.status === 'active'}>{t(`status_${dev.status}`)}</Badge>
            </div>
            <p className="app-detail-hero__username">{dev.companyName}</p>
          </div>
        </div>

        <Card className="app-detail-action-bar">
          {dev.status === 'pending_review' && (
            <Button variant="success" size="sm" onClick={() => setModal('approve')}>{t('action_approve')}</Button>
          )}
          {dev.status === 'active' && (
            <Button variant="danger" size="sm" onClick={() => setModal('suspend')}>{t('action_suspend_admin')}</Button>
          )}
          {dev.status === 'suspended' && (
            <Button variant="success" size="sm" onClick={() => setModal('reactivate')}>{t('action_reactivate_admin')}</Button>
          )}
        </Card>

        <Card className="info-card">
          <div className="info-row"><span className="info-row__label"><IconMail width={14} height={14} style={{ display: 'inline', marginRight: 6 }} />{t('col_email')}</span><span className="info-row__value">{dev.email}</span></div>
          <Divider />
          <div className="info-row"><span className="info-row__label"><IconBuilding width={14} height={14} style={{ display: 'inline', marginRight: 6 }} />{t('col_company')}</span><span className="info-row__value">{dev.companyName}</span></div>
          {dev.website && (
            <>
              <Divider />
              <div className="info-row">
                <span className="info-row__label"><IconGlobe width={14} height={14} style={{ display: 'inline', marginRight: 6 }} />Website</span>
                <a href={dev.website} target="_blank" rel="noreferrer" className="info-row__value" style={{ color: 'var(--blue)' }}>
                  {dev.website} <IconExternal width={11} height={11} style={{ display: 'inline' }} />
                </a>
              </div>
            </>
          )}
          <Divider />
          <div className="info-row"><span className="info-row__label">{t('created')}</span><span className="info-row__value">{new Date(dev.createdAt).toLocaleString()}</span></div>
          {dev.moderation?.suspendedReason && (
            <>
              <Divider />
              <div className="info-row"><span className="info-row__label">{t('suspended_reason_label')}</span><span className="info-row__value">{dev.moderation.suspendedReason}</span></div>
            </>
          )}
        </Card>

        {/* Apps published by this developer */}
        <Card className="info-card">
          <p className="app-detail-hero__username" style={{ marginBottom: 8 }}>{t('col_apps_count')} ({data.apps?.length || 0})</p>
          {data.apps?.length ? data.apps.map((app, i) => (
            <div key={app._id}>
              {i > 0 && <Divider />}
              <button className="info-row" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(`/apps/${app._id}`)}>
                <span className="info-row__label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {app.iconUrl ? <img src={app.iconUrl} alt="" style={{ width: 22, height: 22, borderRadius: 5 }} /> : null}
                  {app.name}
                </span>
                <span className="info-row__value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconStar width={11} height={11} style={{ color: 'var(--amber)' }} />{app.rating?.average?.toFixed(1) || '—'}
                  <Badge variant={app.status === 'live' ? 'live' : app.status === 'under_review' ? 'review' : 'suspended'}>{t(`status_${app.status}`)}</Badge>
                </span>
              </button>
            </div>
          )) : <EmptyState title={t('no_results')} />}
        </Card>
      </div>

      <ConfirmActionModal
        open={modal === 'approve'} onClose={() => setModal(null)} onConfirm={handleApprove}
        title={t('dev_approve_title')} description={t('dev_approve_desc')}
        confirmLabel={t('action_approve')} cancelLabel={t('cancel')} variant="primary"
      />
      <ConfirmActionModal
        open={modal === 'suspend'} onClose={() => setModal(null)} onConfirm={handleSuspend}
        title={t('dev_suspend_title')} description={t('dev_suspend_desc')}
        confirmLabel={t('action_suspend_admin')} cancelLabel={t('cancel')}
        requireReason reasonLabel={t('reason_label')} reasonPlaceholder={t('reason_placeholder')}
      />
      <ConfirmActionModal
        open={modal === 'reactivate'} onClose={() => setModal(null)} onConfirm={handleReactivate}
        title={t('dev_reactivate_title')} description={t('dev_reactivate_desc')}
        confirmLabel={t('action_reactivate_admin')} cancelLabel={t('cancel')} variant="primary"
      />
    </div>
  );
}
