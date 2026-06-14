import React, { createContext, useState, useEffect, useContext } from 'react';
import { transactionService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');
    
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUser({ username: savedUsername });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setError(null);
    try {
      const data = await transactionService.login(username, password);
      // Save token and user details locally
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      setToken(data.token);
      setUser({ username });
      return true;
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      const data = await transactionService.register(username, email, password);
      // Save token and user details locally
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      setToken(data.token);
      setUser({ username: data.username, email: data.email });
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      // Attempt clean token deletion on backend if connected
      if (token) {
        await transactionService.logout();
      }
    } catch (err) {
      console.warn('Backend logout error (clearing local session anyway):', err);
    } finally {
      // Always clear local session
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setToken(null);
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError
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
