import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileTopBar } from '../../components/layout/MobileTopBar';
import { Card, Badge, Divider, RoleBadge } from '../../components/ui/Primitives';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { IconUser, IconMail, IconLock, IconGlobe, IconCheckCircle, IconLogout } from '../../components/ui/icons';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useToast } from '../../context/ToastContext';
import { LANGUAGES } from '../../utils/i18n';
import { authApi } from '../../api/auth';
import { ApiError } from '../../api/client';
import './account.css';

export default function AccountPage() {
  const { admin, logout } = useAuth();
  const { t, lang, setLang } = useLang();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const initials = (admin?.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const changePassword = async () => {
    setPassError('');
    if (!oldPassword || !newPassword) { setPassError('Fill in both fields.'); return; }
    setPassLoading(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      showToast('Password changed. Other sessions signed out.', 'success');
      setOldPassword(''); setNewPassword('');
    } catch (err) {
      setPassError(err instanceof ApiError ? err.message : 'Error changing password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="account-page">
      <MobileTopBar title={t('account_title')} />
      <div className="account-page__inner">
        <h1 className="account-page__title display">{t('account_title')}</h1>
        <p className="account-page__subtitle">{t('account_subtitle')}</p>

        <Card className="account-hero" glow>
          <span className="account-hero__avatar">{initials}</span>
          <div className="account-hero__info">
            <p className="account-hero__name">{admin?.fullName}</p>
            <p className="account-hero__email mono">{admin?.email}</p>
          </div>
          <RoleBadge role={admin?.role} />
        </Card>

        <p className="account-section-title">{t('language_label')}</p>
        <Card className="account-section">
          {LANGUAGES.map((l, i) => (
            <div key={l.code}>
              {i > 0 && <Divider />}
              <button className={`account-lang-row ${lang === l.code ? 'is-active' : ''}`} onClick={() => setLang(l.code)}>
                <span className="account-row__icon"><IconGlobe width={17} height={17} /></span>
                <span className="account-row__value">{l.label}</span>
                {lang === l.code && <IconCheckCircle width={18} height={18} style={{ color: 'var(--red)', marginLeft: 'auto' }} />}
              </button>
            </div>
          ))}
        </Card>

        <p className="account-section-title">{t('change_password')}</p>
        <Card className="account-section" style={{ padding: '16px 18px' }}>
          {passError && <div className="aauth-error" style={{ marginBottom: 12 }}>{passError}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label={t('current_password')} type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} icon={<IconLock width={16} height={16} />} />
            <Field label={t('new_password')} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<IconLock width={16} height={16} />} />
            <Button fullWidth loading={passLoading} onClick={changePassword}>{t('change_password')}</Button>
          </div>
        </Card>

        <Button variant="danger" fullWidth icon={<IconLogout width={16} height={16} />} onClick={onLogout} style={{ marginTop: 4 }}>
          {t('nav_logout')}
        </Button>
      </div>
    </div>
  );
}
