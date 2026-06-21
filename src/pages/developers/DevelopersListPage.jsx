import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { Toolbar, SelectFilter } from '../../components/ui/Toolbar';
import { DataTable } from '../../components/ui/DataTable';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Primitives';
import { IconCheckCircle, IconChevronRight } from '../../components/ui/icons';
import { developersApi } from '../../api/developers';
import { useDebounce } from '../../hooks/useDebounce';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import '../apps/apps-list.css';

const statusVariant = (status) => (
  status === 'active' ? 'live' : status === 'pending_review' ? 'review' : 'suspended'
);

export default function DevelopersListPage() {
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await developersApi.list({ page, limit: 20, status, q: debouncedSearch });
      setRows(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [status, debouncedSearch]);
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (status !== 'all') next.set('status', status); else next.delete('status');
    setSearchParams(next, { replace: true });
  }, [status]); // eslint-disable-line

  const columns = [
    {
      key: 'fullName', label: t('col_developer_name'),
      render: (row) => (
        <div className="apps-cell-app">
          <span className="apps-cell-app__ph">{row.fullName?.[0]}</span>
          <div>
            <span className="apps-cell-app__name">
              {row.fullName}
              {row.isVerified && <IconCheckCircle width={13} height={13} className="apps-cell-app__verified" />}
            </span>
            <span className="apps-cell-app__username">{row.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'companyName', label: t('col_company'), render: (row) => <span className="apps-cell-muted">{row.companyName}</span> },
    {
      key: 'status', label: t('col_status'),
      render: (row) => <Badge variant={statusVariant(row.status)} dot={row.status === 'active'}>{t(`status_${row.status}`)}</Badge>,
    },
    { key: 'createdAt', label: t('created'), render: (row) => <span className="apps-cell-muted">{new Date(row.createdAt).toLocaleDateString()}</span> },
    { key: '_chev', label: '', className: 'apps-col-chev', render: () => <IconChevronRight width={16} height={16} style={{ color: 'var(--text-tertiary)' }} /> },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader title={t('dev_title')} subtitle={t('dev_subtitle')} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('search_placeholder')}
        filters={
          <SelectFilter
            value={status}
            onChange={setStatus}
            options={[
              { value: 'all', label: t('status_all') },
              { value: 'pending_review', label: t('status_pending_review') },
              { value: 'active', label: t('status_active') },
              { value: 'suspended', label: t('status_suspended') },
            ]}
          />
        }
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        onRowClick={(row) => navigate(`/developers/${row._id}`)}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-cell-app">
              <span className="apps-cell-app__ph">{row.fullName?.[0]}</span>
              <div>
                <span className="apps-cell-app__name">{row.fullName}</span>
                <span className="apps-cell-app__username">{row.companyName}</span>
              </div>
            </div>
            <div className="apps-mobile-card__meta">
              <Badge variant={statusVariant(row.status)} dot={row.status === 'active'}>{t(`status_${row.status}`)}</Badge>
            </div>
          </div>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
