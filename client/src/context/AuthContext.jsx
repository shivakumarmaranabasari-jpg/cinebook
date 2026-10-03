import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, fetchUserProfile, updateUserProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cinebook_token');
      const storedUser = localStorage.getItem('cinebook_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          // Verify and sync latest profile from backend
          const res = await fetchUserProfile();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('cinebook_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res && res.data) {
      const { token: userToken, ...userData } = res.data;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('cinebook_token', userToken);
      localStorage.setItem('cinebook_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, phone) => {
    const res = await registerApi({ name, email, password, phone });
    if (res && res.data) {
      const { token: userToken, ...userData } = res.data;
      setToken(userToken);
      setUser(userData);
      localStorage.setItem('cinebook_token', userToken);
      localStorage.setItem('cinebook_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    throw new Error(res.message || 'Registration failed');
  };

  const updateProfile = async (formData) => {
    const res = await updateUserProfile(formData);
    if (res && res.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
      localStorage.setItem('cinebook_user', JSON.stringify({ ...user, ...res.data }));
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cinebook_token');
    localStorage.removeItem('cinebook_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
