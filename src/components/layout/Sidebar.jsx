import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  IconDashboard, IconApps, IconDeveloper, IconUsers, IconFlag,
  IconBridge, IconCrown, IconHistory, IconLogout, IconMore, IconX,
} from '../ui/icons';
import { OrbitMark } from '../ui/OrbitMark';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { RoleBadge } from '../ui/Primitives';
import './sidebar.css';

function navItems(t, role) {
  const items = [
    { to: '/dashboard', icon: IconDashboard, label: t('nav_dashboard') },
    { to: '/apps', icon: IconApps, label: t('nav_apps') },
    { to: '/developers', icon: IconDeveloper, label: t('nav_developers') },
    { to: '/users', icon: IconUsers, label: t('nav_users') },
    { to: '/reports', icon: IconFlag, label: t('nav_reports') },
    { to: '/bridge', icon: IconBridge, label: t('nav_bridge') },
  ];
  if (role === 'super_admin') {
    items.push({ to: '/admins', icon: IconCrown, label: t('nav_admins') });
  }
  items.push({ to: '/audit-log', icon: IconHistory, label: t('nav_audit') });
  return items;
}

export function Sidebar() {
  const { admin, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const items = navItems(t, admin?.role);
  const initials = (admin?.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <OrbitMark size={26} alert />
        <span className="sidebar__brand-name display">Jora Apps Admin</span>
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? 'is-active' : ''}`}
          >
            <item.icon width={19} height={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <NavLink to="/account" className="sidebar__profile">
          <span className="sidebar__avatar">{initials}</span>
          <div className="sidebar__profile-info">
            <span className="sidebar__profile-name">{admin?.fullName}</span>
            <RoleBadge role={admin?.role} />
          </div>
        </NavLink>
        <button className="sidebar__logout" onClick={onLogout} aria-label={t('nav_logout')}>
          <IconLogout width={17} height={17} />
        </button>
      </div>
    </aside>
  );
}

/* ---- Mobile: bottom tab bar + "more" sheet for overflow items ---- */
export function MobileTabBar() {
  const { admin, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const items = navItems(t, admin?.role);
  const primary = items.slice(0, 4);
  const overflow = items.slice(4);

  const onLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <nav className="mtab">
        {primary.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `mtab__item ${isActive ? 'is-active' : ''}`}>
            <item.icon width={21} height={21} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button className="mtab__item" onClick={() => setMoreOpen(true)}>
          <IconMore width={21} height={21} />
          <span>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="mtab-sheet-backdrop" onMouseDown={() => setMoreOpen(false)}>
          <div className="mtab-sheet" onMouseDown={(e) => e.stopPropagation()}>
            <div className="mtab-sheet__grip" />
            <div className="mtab-sheet__header">
              <span className="display">Menu</span>
              <button onClick={() => setMoreOpen(false)}><IconX width={18} height={18} /></button>
            </div>
            {overflow.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="mtab-sheet__item"
                onClick={() => setMoreOpen(false)}
              >
                <item.icon width={19} height={19} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <NavLink to="/account" className="mtab-sheet__item" onClick={() => setMoreOpen(false)}>
              <span className="sidebar__avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                {(admin?.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()}
              </span>
              <span>{admin?.fullName}</span>
            </NavLink>
            <button className="mtab-sheet__item mtab-sheet__item--danger" onClick={onLogout}>
              <IconLogout width={19} height={19} />
              <span>{t('nav_logout')}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
