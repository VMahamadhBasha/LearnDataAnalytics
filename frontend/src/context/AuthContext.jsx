import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user exist in storage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      // data contains: token, type, id, username, email, roles
      localStorage.setItem('token', data.token);
      
      const userPayload = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
      };
      localStorage.setItem('user', JSON.stringify(userPayload));
      setUser(userPayload);
      return userPayload;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, firstName, lastName) => {
    setLoading(true);
    try {
      return await authService.register(username, email, password, firstName, lastName);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const updated = {
          ...parsed,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
      }
    } catch (error) {
      console.error("Failed to refresh user profile data", error);
    }
  };

  const isAdmin = () => {
    return user && user.roles && user.roles.includes('ROLE_ADMIN');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
    isAdmin,
  };

  /*
   * TODO: Dark Mode & Multi-language Support Integration
   * - Why: Providing a premium experience requires dark/light switching and localization support (e.g. i18n).
   * - Files to Change/Create:
   *   - Create ThemeContext.jsx to toggle a `.light-theme` class on `document.documentElement`.
   *   - Modify index.css to map light-theme custom variable overlays.
   *   - Create i18n.js configured with react-i18next translation bundles (English, Spanish, etc.).
   *   - Integrate a language selector in Profile.jsx and Navbar.jsx.
   * - Database Tables to Add:
   *   - None (client-side preference storage or user table preference field extension).
   * - APIs Required:
   *   - PUT /api/student/preferences: To sync theme and language choices to database.
   * - Implementation Approach:
   *   - Use localStorage to cache language and theme choices.
   *   - Query `window.matchMedia('(prefers-color-scheme: dark)')` to default theme on first load.
   */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
