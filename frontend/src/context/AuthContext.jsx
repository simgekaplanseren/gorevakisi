import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, extractError } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'Admin';

  const persistAuth = useCallback((authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    setUser(authData.user);
  }, []);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persistAuth(data);
    return data;
  };

  const register = async (formData) => {
    const data = await authApi.register(formData);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      updateUser,
      extractError,
    }),
    [user, loading, isAuthenticated, isAdmin, persistAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
