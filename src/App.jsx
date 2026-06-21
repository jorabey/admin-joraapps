import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { ToastProvider } from './context/ToastContext';
import { AppShell, PlainShell } from './components/layout/AppShell';
import { OrbitLoader } from './components/ui/OrbitMark';

import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AccountPage from './pages/dashboard/AccountPage';
import AppsListPage from './pages/apps/AppsListPage';
import AppDetailPage from './pages/apps/AppDetailPage';
import DevelopersListPage from './pages/developers/DevelopersListPage';
import DeveloperDetailPage from './pages/developers/DeveloperDetailPage';
import UsersListPage from './pages/users/UsersListPage';
import UserDetailPage from './pages/users/UserDetailPage';
import ReportsListPage from './pages/reports/ReportsListPage';
import BridgePage from './pages/bridge/BridgePage';
import AdminsPage from './pages/admins/AdminsPage';
import AuditLogPage from './pages/audit/AuditLogPage';

function FullscreenLoader() {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <OrbitLoader size={44} />
    </div>
  );
}

function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <FullscreenLoader />;
  if (status === 'guest') return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function RequireSuperAdmin({ children }) {
  const { admin, status } = useAuth();
  if (status === 'loading') return <FullscreenLoader />;
  if (admin?.role !== 'super_admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { status } = useAuth();
  if (status === 'loading') return <FullscreenLoader />;
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <LangProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />

              {/* Top-level tabs */}
              <Route element={<RequireAuth><AppShell /></RequireAuth>}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/apps" element={<AppsListPage />} />
                <Route path="/developers" element={<DevelopersListPage />} />
                <Route path="/users" element={<UsersListPage />} />
                <Route path="/reports" element={<ReportsListPage />} />
                <Route path="/bridge" element={<BridgePage />} />
                <Route path="/audit-log" element={<AuditLogPage />} />
              </Route>

              {/* Drill-down pages */}
              <Route element={<RequireAuth><PlainShell /></RequireAuth>}>
                <Route path="/apps/:id" element={<AppDetailPage />} />
                <Route path="/developers/:id" element={<DeveloperDetailPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route
                  path="/admins"
                  element={<RequireSuperAdmin><AdminsPage /></RequireSuperAdmin>}
                />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </LangProvider>
  );
}
