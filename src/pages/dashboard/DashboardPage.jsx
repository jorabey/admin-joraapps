import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, Badge, EmptyState } from '../../components/ui/Primitives';
import { AreaChart } from '../../components/charts/AreaChart';
import { OrbitLoader } from '../../components/ui/OrbitMark';
import {
  IconUsers, IconDeveloper, IconApps, IconFlag, IconActivity,
  IconStar, IconClock,
} from '../../components/ui/icons';
import { dashboardApi } from '../../api/dashboard';
import { usePolling } from '../../hooks/usePolling';
import { useLang } from '../../context/LangContext';
import './dashboard.css';

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function DashboardPage() {
  const { t } = useLang();
  const navigate = useNavigate();

  const { data: overviewRes, loading: l1 } = usePolling(
    () => dashboardApi.overview(),
    { intervalMs: 15000 }
  );
  const { data: activityRes, loading: l2 } = usePolling(
    () => dashboardApi.activity(8),
    { intervalMs: 20000 }
  );
  const { data: growthRes, loading: l3 } = usePolling(
    () => dashboardApi.growth(14),
    { intervalMs: 60000 }
  );

  const overview = overviewRes?.data;
  const activity = activityRes?.data;
  const growth = growthRes?.data;

  const chartData = useMemo(() => {
    if (!growth?.userTrend) return [];
    const map = {};
    growth.userTrend.forEach((d) => { map[d._id] = (map[d._id] || 0) + d.count; });
    growth.appTrend?.forEach((d) => { map[d._id] = map[d._id] || 0; });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, value]) => ({ label, value }));
  }, [growth]);

  const loading = l1 && !overview;

  if (loading) {
    return (
      <div className="dash-page">
        <PageHeader title={t('dash_title')} subtitle={t('dash_subtitle')} />
        <div className="dash-loading"><OrbitLoader size={40} /></div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <PageHeader
        title={t('dash_title')}
        subtitle={t('dash_subtitle')}
        right={<Badge variant="live" dot>{t('status_live').toUpperCase()}</Badge>}
      />

      <div className="dash-page__inner">
        {/* Metrics grid */}
        <div className="dash-metrics">
          <MetricCard
            icon={<IconUsers width={20} height={20} />}
            label={t('m_total_users')}
            value={overview?.users.total.toLocaleString()}
            delta={overview?.users.new24h}
            deltaLabel={t('new_24h')}
            color="red"
          />
          <MetricCard
            icon={<IconDeveloper width={20} height={20} />}
            label={t('m_total_developers')}
            value={overview?.developers.total.toLocaleString()}
            delta={overview?.developers.new24h}
            deltaLabel={t('new_24h')}
            color="violet"
          />
          <MetricCard
            icon={<IconApps width={20} height={20} />}
            label={t('m_total_apps')}
            value={overview?.apps.total.toLocaleString()}
            delta={overview?.apps.new24h}
            deltaLabel={t('new_24h')}
            color="blue"
          />
          <MetricCard
            icon={<IconFlag width={20} height={20} />}
            label={t('m_pending_reports')}
            value={overview?.reports.pending.toLocaleString()}
            color="amber"
          />
        </div>

        {/* Secondary status row */}
        <div className="dash-status-row">
          <Card className="dash-status-card" onClick={() => navigate('/developers?status=pending_review')}>
            <span className="dash-status-card__value">{overview?.developers.pendingReview}</span>
            <span className="dash-status-card__label">{t('m_pending_developers')}</span>
          </Card>
          <Card className="dash-status-card" onClick={() => navigate('/apps?status=under_review')}>
            <span className="dash-status-card__value">{overview?.apps.underReview}</span>
            <span className="dash-status-card__label">{t('m_under_review_apps')}</span>
          </Card>
          <Card className="dash-status-card" onClick={() => navigate('/apps?status=live')}>
            <span className="dash-status-card__value">{overview?.apps.live}</span>
            <span className="dash-status-card__label">{t('m_live_apps')}</span>
          </Card>
          <Card className="dash-status-card" onClick={() => navigate('/apps?status=suspended')}>
            <span className="dash-status-card__value">{overview?.apps.suspended}</span>
            <span className="dash-status-card__label">{t('m_suspended_apps')}</span>
          </Card>
          <Card className="dash-status-card">
            <span className="dash-status-card__value">{overview?.users.blocked}</span>
            <span className="dash-status-card__label">{t('m_blocked_users')}</span>
          </Card>
          <Card className="dash-status-card">
            <span className="dash-status-card__value">{overview?.connections.totalActive}</span>
            <span className="dash-status-card__label">{t('m_active_connections')}</span>
          </Card>
        </div>

        {/* Growth chart */}
        <Card className="dash-chart-card">
          <div className="dash-chart-card__head">
            <div>
              <p className="dash-chart-card__title display">{t('growth_title')}</p>
              <p className="dash-chart-card__subtitle">{t('growth_subtitle')}</p>
            </div>
          </div>
          {chartData.length > 0 ? (
            <AreaChart data={chartData} height={200} />
          ) : (
            <div className="dash-chart-card__empty">{l3 ? <OrbitLoader size={28} /> : t('no_results')}</div>
          )}
        </Card>

        {/* Activity feed */}
        <div className="dash-activity-grid">
          <Card className="dash-activity-card">
            <p className="dash-activity-card__title">{t('activity_apps')}</p>
            {activity?.recentApps?.length ? (
              <div className="dash-activity-list">
                {activity.recentApps.slice(0, 6).map((app) => (
                  <button key={app._id} className="dash-activity-row" onClick={() => navigate(`/apps/${app._id}`)}>
                    {app.iconUrl ? <img src={app.iconUrl} alt="" className="dash-activity-row__icon" /> : (
                      <span className="dash-activity-row__icon dash-activity-row__icon--ph">{app.name?.[0]}</span>
                    )}
                    <div className="dash-activity-row__info">
                      <span className="dash-activity-row__name">{app.name}</span>
                      <span className="dash-activity-row__time"><IconClock width={11} height={11} />{timeAgo(app.createdAt)}</span>
                    </div>
                    <Badge variant={app.status === 'live' ? 'live' : app.status === 'under_review' ? 'review' : 'suspended'}>
                      {t(`status_${app.status}`)}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : <EmptyState icon={<IconApps width={18} height={18} />} title={t('no_results')} />}
          </Card>

          <Card className="dash-activity-card">
            <p className="dash-activity-card__title">{t('activity_reports')}</p>
            {activity?.recentReports?.length ? (
              <div className="dash-activity-list">
                {activity.recentReports.slice(0, 6).map((r) => (
                  <button key={r._id} className="dash-activity-row" onClick={() => navigate('/reports')}>
                    <span className="dash-activity-row__icon dash-activity-row__icon--ph dash-activity-row__icon--flag">
                      <IconFlag width={15} height={15} />
                    </span>
                    <div className="dash-activity-row__info">
                      <span className="dash-activity-row__name">{r.appId?.name || 'Unknown app'}</span>
                      <span className="dash-activity-row__time"><IconClock width={11} height={11} />{timeAgo(r.createdAt)}</span>
                    </div>
                    <Badge variant="review">{t(`reason_${r.reason}`)}</Badge>
                  </button>
                ))}
              </div>
            ) : <EmptyState icon={<IconFlag width={18} height={18} />} title={t('no_results')} />}
          </Card>

          <Card className="dash-activity-card">
            <p className="dash-activity-card__title">{t('activity_developers')}</p>
            {activity?.recentDevelopers?.length ? (
              <div className="dash-activity-list">
                {activity.recentDevelopers.slice(0, 6).map((d) => (
                  <button key={d._id} className="dash-activity-row" onClick={() => navigate(`/developers/${d._id}`)}>
                    <span className="dash-activity-row__icon dash-activity-row__icon--ph">{d.fullName?.[0]}</span>
                    <div className="dash-activity-row__info">
                      <span className="dash-activity-row__name">{d.fullName}</span>
                      <span className="dash-activity-row__time"><IconClock width={11} height={11} />{timeAgo(d.createdAt)}</span>
                    </div>
                    <Badge variant={d.status === 'active' ? 'live' : d.status === 'pending_review' ? 'review' : 'suspended'}>
                      {t(`status_${d.status}`)}
                    </Badge>
                  </button>
                ))}
              </div>
            ) : <EmptyState icon={<IconDeveloper width={18} height={18} />} title={t('no_results')} />}
          </Card>

          <Card className="dash-activity-card">
            <p className="dash-activity-card__title">{t('activity_logs')}</p>
            {activity?.recentAuditLogs?.length ? (
              <div className="dash-activity-list">
                {activity.recentAuditLogs.slice(0, 6).map((log) => (
                  <div key={log._id} className="dash-activity-row dash-activity-row--static">
                    <span className="dash-activity-row__icon dash-activity-row__icon--ph">
                      <IconActivity width={15} height={15} />
                    </span>
                    <div className="dash-activity-row__info">
                      <span className="dash-activity-row__name">{log.description}</span>
                      <span className="dash-activity-row__time">
                        <IconClock width={11} height={11} />{timeAgo(log.createdAt)} · {log.adminEmail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState icon={<IconActivity width={18} height={18} />} title={t('no_results')} />}
          </Card>
        </div>
      </div>
    </div>
  );
}
