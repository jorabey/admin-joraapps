import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, Badge, Divider, EmptyState } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { OrbitLoader } from '../../components/ui/OrbitMark';
import { IconChevronLeft, IconMail, IconPhone } from '../../components/ui/icons';
import { usersApi } from '../../api/users';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import '../apps/app-detail.css';

export default function UserDetailPage() {
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
      const res = await usersApi.detail(id);
      setData(res.data);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { load(); }, [load]);

  const user = data?.user;

  const handleBlock = async (reason) => {
    await usersApi.block(id, reason);
    showToast('User blocked. Sessions terminated.', 'warn');
    setModal(null);
    load();
  };
  const handleUnblock = async () => {
    await usersApi.unblock(id);
    showToast('User unblocked.', 'success');
    setModal(null);
    load();
  };
  const handleForceLogout = async () => {
    const res = await usersApi.forceLogout(id);
    showToast(res.message || 'Sessions terminated.', 'success');
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

  if (!user) return <div className="app-detail-page"><PageHeader title="404" /><EmptyState title="User not found" /></div>;

  return (
    <div className="app-detail-page">
      <PageHeader title={`${user.firstName} ${user.lastName}`} />
      <div className="app-detail-page__inner">
        <button className="app-detail-back" onClick={() => navigate('/users')}>
          <IconChevronLeft width={15} height={15} /> {t('users_title')}
        </button>

        <div className="app-detail-hero">
          <div className="app-detail-hero__icon app-detail-hero__icon--ph">{user.firstName?.[0]}</div>
          <div className="app-detail-hero__info">
            <div className="app-detail-hero__name-row">
              <h1 className="app-detail-hero__name display">{user.firstName} {user.lastName}</h1>
              <Badge variant={user.isBlocked ? 'blocked' : 'live'} dot={!user.isBlocked}>{user.isBlocked ? t('col_blocked') : t('status_active')}</Badge>
            </div>
            <p className="app-detail-hero__username">@{user.username}</p>
          </div>
        </div>

        <Card className="app-detail-action-bar">
          {user.isBlocked ? (
            <Button variant="success" size="sm" onClick={() => setModal('unblock')}>{t('action_unblock')}</Button>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setModal('block')}>{t('action_block')}</Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setModal('force_logout')}>{t('action_force_logout')}</Button>
        </Card>

        <Card className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-cell">
            <div><p className="stat-cell__value">{data.connectionsCount}</p><p className="stat-cell__label">{t('app_active_connections')}</p></div>
          </div>
          <div className="stat-cell">
            <div><p className="stat-cell__value">{data.reportsFiledCount}</p><p className="stat-cell__label">Reports filed</p></div>
          </div>
          <div className="stat-cell">
            <div><p className="stat-cell__value">{data.activeSessions}</p><p className="stat-cell__label">Active sessions</p></div>
          </div>
        </Card>

        <Card className="info-card">
          <div className="info-row"><span className="info-row__label"><IconMail width={14} height={14} style={{ display: 'inline', marginRight: 6 }} />{t('col_email')}</span><span className="info-row__value">{user.email}</span></div>
          {user.phone && (
            <>
              <Divider />
              <div className="info-row"><span className="info-row__label"><IconPhone width={14} height={14} style={{ display: 'inline', marginRight: 6 }} />Phone</span><span className="info-row__value">{user.phone}</span></div>
            </>
          )}
          <Divider />
          <div className="info-row"><span className="info-row__label">{t('created')}</span><span className="info-row__value">{new Date(user.createdAt).toLocaleString()}</span></div>
          {user.moderation?.blockedReason && (
            <>
              <Divider />
              <div className="info-row"><span className="info-row__label">{t('user_blocked_reason')}</span><span className="info-row__value">{user.moderation.blockedReason}</span></div>
            </>
          )}
        </Card>
      </div>

      <ConfirmActionModal
        open={modal === 'block'} onClose={() => setModal(null)} onConfirm={handleBlock}
        title={t('user_block_title')} description={t('user_block_desc')}
        confirmLabel={t('action_block')} cancelLabel={t('cancel')}
        requireReason reasonLabel={t('reason_label')} reasonPlaceholder={t('reason_placeholder')}
      />
      <ConfirmActionModal
        open={modal === 'unblock'} onClose={() => setModal(null)} onConfirm={handleUnblock}
        title={t('user_unblock_title')} description={t('user_unblock_desc')}
        confirmLabel={t('action_unblock')} cancelLabel={t('cancel')} variant="primary"
      />
      <ConfirmActionModal
        open={modal === 'force_logout'} onClose={() => setModal(null)} onConfirm={handleForceLogout}
        title={t('user_force_logout_title')} description={t('user_force_logout_desc')}
        confirmLabel={t('action_force_logout')} cancelLabel={t('cancel')}
      />
    </div>
  );
}
