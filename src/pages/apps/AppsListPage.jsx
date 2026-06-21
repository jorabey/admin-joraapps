import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toolbar, SelectFilter } from '../../components/ui/Toolbar';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { IconStar, IconCheckCircle, IconChevronRight } from '../../components/ui/icons';
import { appsApi, CATEGORIES } from '../../api/apps';
import { useDebounce } from '../../hooks/useDebounce';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import './apps-list.css';

const statusVariant = (status) => (
  status === 'live' ? 'live' : status === 'under_review' ? 'review' : 'suspended'
);

export default function AppsListPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appsApi.list({ page, limit: 20, status, category, q: debouncedSearch, sortBy });
      setRows(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      showToast(err?.message || 'Error loading apps', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, category, debouncedSearch, sortBy, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [status, category, debouncedSearch, sortBy]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (status !== 'all') next.set('status', status); else next.delete('status');
    setSearchParams(next, { replace: true });
  }, [status]); // eslint-disable-line

  const columns = [
    {
      key: 'name', label: t('col_app'),
      render: (row) => (
        <div className="apps-cell-app">
          {row.iconUrl ? <img src={row.iconUrl} alt="" /> : <span className="apps-cell-app__ph">{row.name?.[0]}</span>}
          <div>
            <span className="apps-cell-app__name">{row.name}</span>
            {row.isVerified && <IconCheckCircle width={13} height={13} className="apps-cell-app__verified" />}
            <span className="apps-cell-app__username">@{row.username}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'status', label: t('col_status'),
      render: (row) => <Badge variant={statusVariant(row.status)} dot={row.status === 'live'}>{t(`status_${row.status}`)}</Badge>,
    },
    {
      key: 'category', label: t('col_category'),
      render: (row) => <span className="apps-cell-muted">{t(`cat_${row.category}`)}</span>,
    },
    {
      key: 'rating', label: t('col_rating'),
      render: (row) => (
        <span className="apps-cell-rating">
          <IconStar width={12} height={12} />{row.rating?.average?.toFixed(1) || '—'}
        </span>
      ),
    },
    {
      key: 'mau', label: t('col_mau'),
      render: (row) => <span className="mono apps-cell-muted">{(row.stats?.mau || 0).toLocaleString()}</span>,
    },
    {
      key: '_chev', label: '', className: 'apps-col-chev',
      render: () => <IconChevronRight width={16} height={16} style={{ color: 'var(--text-tertiary)' }} />,
    },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader title={t('apps_title')} subtitle={t('apps_subtitle')} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_placeholder')}
        filters={
          <>
            <SelectFilter
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: t('status_all') },
                { value: 'under_review', label: t('status_under_review') },
                { value: 'live', label: t('status_live') },
                { value: 'suspended', label: t('status_suspended') },
              ]}
            />
            <SelectFilter
              value={category}
              onChange={setCategory}
              options={[{ value: 'all', label: t('status_all') }, ...CATEGORIES.map((c) => ({ value: c, label: t(`cat_${c}`) }))]}
            />
            <SelectFilter
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'rating', label: t('col_rating') },
                { value: 'mau', label: 'MAU' },
                { value: 'name', label: 'A–Z' },
              ]}
            />
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        onRowClick={(row) => navigate(`/apps/${row._id}`)}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-cell-app">
              {row.iconUrl ? <img src={row.iconUrl} alt="" /> : <span className="apps-cell-app__ph">{row.name?.[0]}</span>}
              <div>
                <span className="apps-cell-app__name">{row.name}</span>
                <span className="apps-cell-app__username">@{row.username}</span>
              </div>
            </div>
            <div className="apps-mobile-card__meta">
              <Badge variant={statusVariant(row.status)} dot={row.status === 'live'}>{t(`status_${row.status}`)}</Badge>
              <span className="apps-cell-rating"><IconStar width={12} height={12} />{row.rating?.average?.toFixed(1) || '—'}</span>
              <span className="apps-cell-muted">{t(`cat_${row.category}`)}</span>
            </div>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
