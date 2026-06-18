import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('binuthman_token');
      if (token) {
        try {
          const profile = await api.users.getProfile();
          setUser(profile);
        } catch (error) {
          console.error('Session verification failed:', error.message);
          localStorage.removeItem('binuthman_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    localStorage.setItem('binuthman_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('binuthman_token');
    setUser(null);
  };

  const register = async (userData) => {
    return await api.auth.register(userData);
  };

  const updateProfile = async (profileData) => {
    const data = await api.users.updateProfile(profileData);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default useAuth;
