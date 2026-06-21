import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAccessToken, refreshAccessToken, setAccessToken } from '../api/client';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | guest

  const loadMe = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      setAdmin(data.admin);
      setStatus('authenticated');
    } catch {
      setAdmin(null);
      setStatus('guest');
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (getAccessToken()) {
        await loadMe();
        return;
      }
      try {
        await refreshAccessToken();
        await loadMe();
      } catch {
        setStatus('guest');
      }
    })();
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    setAdmin(data.admin);
    setStatus('authenticated');
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    setAdmin(null);
    setAccessToken(null);
    setStatus('guest');
  }, []);

  const refreshMe = useCallback(async () => { await loadMe(); }, [loadMe]);

  return (
    <AuthContext.Provider value={{ admin, status, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
