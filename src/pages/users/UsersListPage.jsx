import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toolbar, SelectFilter } from '../../components/ui/Toolbar';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Primitives';
import { IconChevronRight } from '../../components/ui/icons';
import { usersApi } from '../../api/users';
import { useDebounce } from '../../hooks/useDebounce';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import '../apps/apps-list.css';

export default function UsersListPage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [blocked, setBlocked] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({ page, limit: 20, blocked, q: debouncedSearch });
      setRows(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, blocked, debouncedSearch, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [blocked, debouncedSearch]);

  const columns = [
    {
      key: 'username', label: t('col_username'),
      render: (row) => (
        <div className="apps-cell-app">
          <span className="apps-cell-app__ph">{row.firstName?.[0] || row.username?.[0]}</span>
          <div>
            <span className="apps-cell-app__name">{row.firstName} {row.lastName}</span>
            <span className="apps-cell-app__username">@{row.username}</span>
          </div>
        </div>
      ),
    },
    { key: 'email', label: t('col_email'), render: (row) => <span className="apps-cell-muted">{row.email}</span> },
    {
      key: 'isBlocked', label: t('col_status'),
      render: (row) => <Badge variant={row.isBlocked ? 'blocked' : 'live'} dot={!row.isBlocked}>{row.isBlocked ? t('col_blocked') : t('status_active')}</Badge>,
    },
    { key: 'createdAt', label: t('created'), render: (row) => <span className="apps-cell-muted">{new Date(row.createdAt).toLocaleDateString()}</span> },
    { key: '_chev', label: '', className: 'apps-col-chev', render: () => <IconChevronRight width={16} height={16} style={{ color: 'var(--text-tertiary)' }} /> },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader title={t('users_title')} subtitle={t('users_subtitle')} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_placeholder')}
        filters={
          <SelectFilter
            value={blocked}
            onChange={setBlocked}
            options={[
              { value: 'all', label: t('status_all') },
              { value: 'false', label: t('status_active') },
              { value: 'true', label: t('col_blocked') },
            ]}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        onRowClick={(row) => navigate(`/users/${row._id}`)}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-cell-app">
              <span className="apps-cell-app__ph">{row.firstName?.[0] || row.username?.[0]}</span>
              <div>
                <span className="apps-cell-app__name">{row.firstName} {row.lastName}</span>
                <span className="apps-cell-app__username">@{row.username}</span>
              </div>
            </div>
            <div className="apps-mobile-card__meta">
              <Badge variant={row.isBlocked ? 'blocked' : 'live'} dot={!row.isBlocked}>{row.isBlocked ? t('col_blocked') : t('status_active')}</Badge>
            </div>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
