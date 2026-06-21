import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { OrbitLoader } from '../../components/ui/OrbitMark';
import { IconZap, IconRefresh } from '../../components/ui/icons';
import { bridgeApi } from '../../api/bridge';
import { usePolling } from '../../hooks/usePolling';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import '../apps/apps-list.css';
import './bridge.css';

export default function BridgePage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [modal, setModal] = useState(null); // { type: 'close'|'reopen', app }

  const { data: res, loading, refresh, lastUpdated } = usePolling(
    () => bridgeApi.overview(),
    { intervalMs: 12000 }
  );

  const apps = res?.data?.apps || [];

  const handleClose = async (reason) => {
    await bridgeApi.close(modal.app._id, reason);
    showToast(`Bridge API closed for ${modal.app.name}.`, 'warn');
    setModal(null);
    refresh();
  };

  const handleReopen = async () => {
    await bridgeApi.reopen(modal.app._id);
    showToast(`Bridge API reopened for ${modal.app.name}.`, 'success');
    setModal(null);
    refresh();
  };

  const handleFlush = async (app, e) => {
    e.stopPropagation();
    try {
      const r = await bridgeApi.flushCache(app._id);
      showToast(r.message, 'success');
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    }
  };

  const columns = [
    {
      key: 'name', label: t('col_app'),
      render: (row) => (
        <div className="apps-cell-app">
          <span className="apps-cell-app__ph">{row.name?.[0]}</span>
          <div>
            <span className="apps-cell-app__name">{row.name}</span>
            <span className="apps-cell-app__username">@{row.username}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'bridgeOpen', label: 'Bridge',
      render: (row) => <Badge variant={row.bridgeOpen ? 'live' : 'suspended'} dot={row.bridgeOpen}>{row.bridgeOpen ? t('bridge_open') : t('bridge_closed')}</Badge>,
    },
    {
      key: 'dauToday', label: t('col_dau'),
      render: (row) => <span className="mono apps-cell-muted">{row.dauToday.toLocaleString()}</span>,
    },
    {
      key: 'mau', label: t('col_mau'),
      render: (row) => <span className="mono apps-cell-muted">{row.mau.toLocaleString()}</span>,
    },
    {
      key: '_actions', label: t('actions'),
      render: (row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            variant="ghost" size="sm"
            icon={<IconRefresh width={13} height={13} />}
            onClick={(e) => handleFlush(row, e)}
          >
            {t('action_flush_cache')}
          </Button>
          {row.bridgeOpen ? (
            <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); setModal({ type: 'close', app: row }); }}>
              {t('action_close_bridge')}
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); setModal({ type: 'reopen', app: row }); }}>
              {t('action_reopen_bridge')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader
        title={t('bridge_title')}
        subtitle={t('bridge_subtitle')}
        right={
          <div className="bridge-live-indicator">
            <IconZap width={13} height={13} />
            <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}</span>
          </div>
        }
      />

      {loading && apps.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><OrbitLoader /></div>
      ) : (
        <DataTable
          columns={columns}
          rows={apps}
          loading={false}
          emptyTitle={t('no_results')}
          onRowClick={(row) => navigate(`/apps/${row._id}`)}
          mobileCard={(row) => (
            <div className="apps-mobile-card">
              <div className="apps-cell-app">
                <span className="apps-cell-app__ph">{row.name?.[0]}</span>
                <div>
                  <span className="apps-cell-app__name">{row.name}</span>
                  <span className="apps-cell-app__username">DAU: {row.dauToday} · MAU: {row.mau}</span>
                </div>
              </div>
              <div className="apps-mobile-card__meta">
                <Badge variant={row.bridgeOpen ? 'live' : 'suspended'} dot={row.bridgeOpen}>{row.bridgeOpen ? t('bridge_open') : t('bridge_closed')}</Badge>
                {row.bridgeOpen ? (
                  <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); setModal({ type: 'close', app: row }); }}>{t('action_close_bridge')}</Button>
                ) : (
                  <Button variant="success" size="sm" onClick={(e) => { e.stopPropagation(); setModal({ type: 'reopen', app: row }); }}>{t('action_reopen_bridge')}</Button>
                )}
              </div>
            </div>
          )}
        />
      )}

      <ConfirmActionModal
        open={modal?.type === 'close'}
        onClose={() => setModal(null)}
        onConfirm={handleClose}
        title={t('close_bridge_title')}
        description={t('close_bridge_desc')}
        confirmLabel={t('action_close_bridge')}
        cancelLabel={t('cancel')}
        requireReason
        reasonLabel={t('reason_label')}
        reasonPlaceholder={t('reason_placeholder')}
      />
      <ConfirmActionModal
        open={modal?.type === 'reopen'}
        onClose={() => setModal(null)}
        onConfirm={handleReopen}
        title={t('reopen_bridge_title')}
        description={t('reopen_bridge_desc')}
        confirmLabel={t('action_reopen_bridge')}
        cancelLabel={t('cancel')}
        variant="primary"
      />
    </div>
  );
}
