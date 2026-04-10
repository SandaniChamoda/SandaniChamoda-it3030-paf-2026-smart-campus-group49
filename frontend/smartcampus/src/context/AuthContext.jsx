import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, validate existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    authService.getCurrentUser()
      .then((userData) => {
        setUser(userData);
        setToken(storedToken);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = authService.getGoogleLoginUrl();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore server errors on logout
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      window.location.href = '/login';
    }
  };

  const setAuthToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const value = {
    user,
    setUser,
    token,
    setAuthToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isTechnician: user?.role === 'TECHNICIAN',
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
