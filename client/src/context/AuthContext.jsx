import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, getToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore a session from a stored token (survives refresh).
  useEffect(() => {
    let active = true;
    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const { user } = await api.get('/auth/me');
        if (active) setUser(user);
      } catch {
        setToken(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    restore();
    return () => {
      active = false;
    };
  }, []);

  async function login(email, password) {
    const { token, user } = await api.post('/auth/login', { email, password });
    setToken(token);
    setUser(user);
    return user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  // Convenience: can(module, action) reads the permission map from the server.
  function can(module, action = 'view') {
    const perm = user?.permissions?.[module];
    if (!perm) return false;
    return action === 'edit' ? perm.edit : perm.view;
  }

  const value = useMemo(() => ({ user, loading, login, logout, can }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
