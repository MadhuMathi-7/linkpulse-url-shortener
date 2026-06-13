import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details if token exists
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('linkpulse_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        localStorage.removeItem('linkpulse_token');
      }
    } catch (err) {
      console.error('Session Load Fail:', err.message);
      localStorage.removeItem('linkpulse_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Log in user
  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('linkpulse_token', token);
      setUser(userData);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  };

  // Sign up user
  const signup = async (name, email, password) => {
    const response = await api.post('/auth/signup', { name, email, password });
    if (response.data.success) {
      const { token, ...userData } = response.data.data;
      localStorage.setItem('linkpulse_token', token);
      setUser(userData);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Signup failed');
    }
  };

  // Log out user
  const logout = () => {
    localStorage.removeItem('linkpulse_token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser: loadUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
