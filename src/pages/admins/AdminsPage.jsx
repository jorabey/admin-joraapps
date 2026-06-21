import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { Badge, RoleBadge } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Field } from '../../components/ui/Field';
import { ConfirmActionModal } from '../../components/ui/ConfirmActionModal';
import { IconPlus, IconMail, IconUser, IconLock } from '../../components/ui/icons';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLang } from '../../context/LangContext';
import { ApiError } from '../../api/client';
import '../apps/apps-list.css';

const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function AdminsPage() {
  const { admin: me } = useAuth();
  const { t } = useLang();
  const { showToast } = useToast();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusModal, setStatusModal] = useState(null); // { admin, nextStatus }

  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'moderator' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.listAdmins();
      setRows(res.data?.admins || []);
    } catch (err) {
      showToast(err?.message || 'Error', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.fullName.trim()) { setFormError(t('field_fullname')); return; }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setFormError('Invalid email.'); return; }
    if (!PASSWORD_RE.test(form.password)) {
      setFormError('Password needs 8+ chars with upper, lower, number, special (@$!%*?&).');
      return;
    }
    setFormLoading(true);
    try {
      await authApi.createAdmin(form);
      showToast('Admin created.', 'success');
      setCreateOpen(false);
      setForm({ fullName: '', email: '', password: '', role: 'moderator' });
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Error creating admin.');
    } finally {
      setFormLoading(false);
    }
  };

  const onToggleStatus = async () => {
    const { admin, nextStatus } = statusModal;
    await authApi.setAdminStatus(admin._id, nextStatus);
    showToast(`Admin ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'}.`, nextStatus === 'suspended' ? 'warn' : 'success');
    setStatusModal(null);
    load();
  };

  const columns = [
    {
      key: 'fullName', label: t('field_fullname'),
      render: (row) => (
        <div className="apps-cell-app">
          <span className="apps-cell-app__ph">{row.fullName?.[0]}</span>
          <div>
            <span className="apps-cell-app__name">{row.fullName}{row._id === me?._id ? ' (you)' : ''}</span>
            <span className="apps-cell-app__username">{row.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'role', label: t('field_role'), render: (row) => <RoleBadge role={row.role} /> },
    { key: 'status', label: t('col_status'), render: (row) => <Badge variant={row.status === 'active' ? 'live' : 'suspended'} dot={row.status === 'active'}>{row.status === 'active' ? t('status_active') : t('status_suspended')}</Badge> },
    { key: 'lastLoginAt', label: 'Last login', render: (row) => <span className="apps-cell-muted">{row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleString() : '—'}</span> },
    {
      key: '_actions', label: t('actions'),
      render: (row) => row._id === me?._id ? (
        <span className="apps-cell-muted" style={{ fontSize: 11.5 }}>{t('cannot_modify_self')}</span>
      ) : row.status === 'active' ? (
        <Button variant="danger" size="sm" onClick={() => setStatusModal({ admin: row, nextStatus: 'suspended' })}>{t('action_suspend_admin')}</Button>
      ) : (
        <Button variant="success" size="sm" onClick={() => setStatusModal({ admin: row, nextStatus: 'active' })}>{t('action_reactivate_admin')}</Button>
      ),
    },
  ];

  return (
    <div className="apps-list-page">
      <PageHeader
        title={t('admins_title')}
        subtitle={t('admins_subtitle')}
        right={<Button icon={<IconPlus width={15} height={15} />} onClick={() => setCreateOpen(true)}>{t('new_admin')}</Button>}
      />

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle={t('no_results')}
        mobileCard={(row) => (
          <div className="apps-mobile-card">
            <div className="apps-cell-app">
              <span className="apps-cell-app__ph">{row.fullName?.[0]}</span>
              <div>
                <span className="apps-cell-app__name">{row.fullName}</span>
                <span className="apps-cell-app__username">{row.email}</span>
              </div>
            </div>
            <div className="apps-mobile-card__meta">
              <RoleBadge role={row.role} />
              <Badge variant={row.status === 'active' ? 'live' : 'suspended'} dot={row.status === 'active'}>{row.status === 'active' ? t('status_active') : t('status_suspended')}</Badge>
            </div>
            {row._id !== me?._id && (
              row.status === 'active' ? (
                <Button variant="danger" size="sm" fullWidth onClick={() => setStatusModal({ admin: row, nextStatus: 'suspended' })}>{t('action_suspend_admin')}</Button>
              ) : (
                <Button variant="success" size="sm" fullWidth onClick={() => setStatusModal({ admin: row, nextStatus: 'active' })}>{t('action_reactivate_admin')}</Button>
              )
            )}
          </div>
        )}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title={t('create_admin_title')}>
        <form onSubmit={onCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {formError && <div className="aauth-error">{formError}</div>}
          <Field label={t('field_fullname')} value={form.fullName} onChange={update('fullName')} icon={<IconUser width={16} height={16} />} />
          <Field label={t('login_email')} type="email" value={form.email} onChange={update('email')} icon={<IconMail width={16} height={16} />} />
          <Field label={t('login_password')} type="password" value={form.password} onChange={update('password')} icon={<IconLock width={16} height={16} />} />
          <Field
            label={t('field_role')} as="select" value={form.role} onChange={update('role')}
            options={[
              { value: 'moderator', label: t('role_moderator') },
              { value: 'support', label: t('role_support') },
              { value: 'super_admin', label: t('role_super_admin') },
            ]}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <Button type="button" variant="secondary" fullWidth onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
            <Button type="submit" fullWidth loading={formLoading}>{t('save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmActionModal
        open={!!statusModal}
        onClose={() => setStatusModal(null)}
        onConfirm={onToggleStatus}
        title={statusModal?.nextStatus === 'suspended' ? t('action_suspend_admin') : t('action_reactivate_admin')}
        description={statusModal?.nextStatus === 'suspended' ? t('dev_suspend_desc') : t('dev_reactivate_desc')}
        confirmLabel={statusModal?.nextStatus === 'suspended' ? t('action_suspend_admin') : t('action_reactivate_admin')}
        cancelLabel={t('cancel')}
        variant={statusModal?.nextStatus === 'suspended' ? 'danger' : 'primary'}
      />
    </div>
  );
}
