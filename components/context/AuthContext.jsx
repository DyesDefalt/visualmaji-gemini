'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // SSR-safe localStorage access
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('vima_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const mockUser = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            email,
            name: email.split('@')[0],
            plan: 'free',
            usageToday: 0,
            usageMonth: 0,
            credits: 0,
            createdAt: new Date().toISOString(),
          };
          setUser(mockUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vima_user', JSON.stringify(mockUser));
          }
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signup = async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const mockUser = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            email,
            name: name || email.split('@')[0],
            plan: 'free',
            usageToday: 0,
            usageMonth: 0,
            credits: 0,
            createdAt: new Date().toISOString(),
          };
          setUser(mockUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem('vima_user', JSON.stringify(mockUser));
          }
          resolve(mockUser);
        } else {
          reject(new Error('Invalid signup data'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vima_user');
    }
  };

  const updatePlan = (newPlan) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('vima_user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
