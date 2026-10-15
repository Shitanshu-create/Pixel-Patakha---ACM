import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi.js';
import { getToken, setToken, removeToken } from '../utils/tokenStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setRole(null);
  }, []);

  // Restore session
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await authApi.getMe();
        setUser(me);
        setRole(me?.role || null);
      } catch (err) {
        console.warn('Session restoration failed:', err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('pp_session_expired', handleSessionExpired);
    return () => {
      window.removeEventListener('pp_session_expired', handleSessionExpired);
    };
  }, [logout]);

  const handleAuthSuccess = (res) => {
    // res is { team, token } or { user, token }
    const authToken = res?.token;
    const authEntity = res?.team || res?.user;

    if (authToken) {
      setToken(authToken);
    }
    if (authEntity) {
      setUser(authEntity);
      setRole(authEntity.role);
    }
    return authEntity;
  };

  const registerTeam = async (data) => {
    const res = await authApi.registerTeam(data);
    return handleAuthSuccess(res);
  };

  const loginTeam = async (credentials) => {
    const res = await authApi.loginTeam(credentials);
    return handleAuthSuccess(res);
  };

  const loginStaff = async (credentials) => {
    const res = await authApi.loginStaff(credentials);
    return handleAuthSuccess(res);
  };

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    isLoading,
    registerTeam,
    loginTeam,
    loginStaff,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;
