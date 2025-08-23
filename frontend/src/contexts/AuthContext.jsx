import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

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
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const response = await authAPI.getCurrentUser();
      console.log('Auth check successful:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.log('Auth check failed:', error.response?.status, error.response?.data);
      // Only log if it's not a 401 error (which is expected when not authenticated)
      if (error.response?.status !== 401) {
        console.error('Auth check error:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      console.log('Attempting login...');
      const response = await authAPI.login(credentials);
      console.log('Login successful:', response.data);
      setUser(response.data.user);
      
      // Wait a moment for the cookie to be set
      console.log('Waiting for cookie to be set...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verify the authentication worked by checking the user
      console.log('Verifying authentication...');
      await checkAuth();
      
      return { success: true };
    } catch (error) {
      console.log('Login failed:', error.response?.status, error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authAPI.register(userData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};