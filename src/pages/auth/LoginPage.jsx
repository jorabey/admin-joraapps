import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Field } from '../../components/ui/Field';
import { Button } from '../../components/ui/Button';
import { OrbitMark } from '../../components/ui/OrbitMark';
import { IconMail, IconLock, IconShield } from '../../components/ui/icons';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { ApiError } from '../../api/client';
import './auth.css';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError(t('login_error_generic'));
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('login_error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aauth">
      <div className="aauth__bg" aria-hidden="true">
        <div className="aauth__grid" />
      </div>
      <div className="aauth__card">
        <div className="aauth__brand">
          <OrbitMark size={34} alert />
          <span className="aauth__brand-name display">Jora Apps Admin</span>
        </div>

        <div className="aauth__badge">
          <IconShield width={13} height={13} />
          <span>{t('login_subtitle')}</span>
        </div>

        <h1 className="aauth__title display">{t('login_title')}</h1>

        <form onSubmit={onSubmit} className="aauth__form" noValidate>
          {error && <div className="aauth-error">{error}</div>}
          <Field
            label={t('login_email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<IconMail width={17} height={17} />}
            placeholder="admin@nexa.uz"
            autoComplete="username"
          />
          <Field
            label={t('login_password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<IconLock width={17} height={17} />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth size="lg" loading={loading}>
            {t('login_submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
