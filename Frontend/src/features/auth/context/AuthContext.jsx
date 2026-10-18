import { useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi.js';
import { getToken, setToken, removeToken } from '../utils/tokenStorage.js';
import AuthContext from './AuthContext.js';

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
        // Only log out on 401 Unauthorized; keep session token on network blips or server 5xx
        if (err?.status === 401) {
          logout();
        } else {
          console.warn('Session restoration failed:', err?.message || err);
        }
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

  const adoptSession = useCallback((res) => {
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
  }, []);

  const registerTeam = async (data) => {
    const res = await authApi.registerTeam(data);
    adoptSession(res);
    return res;
  };

  const loginTeam = async (credentials) => {
    const res = await authApi.loginTeam(credentials);
    return adoptSession(res);
  };

  const loginStaff = async (credentials) => {
    const res = await authApi.loginStaff(credentials);
    return adoptSession(res);
  };

  const value = {
    user,
    role,
    isAuthenticated: !!user,
    isLoading,
    adoptSession,
    registerTeam,
    loginTeam,
    loginStaff,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuth } from './AuthContext.js';
export default AuthProvider;
