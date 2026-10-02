import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error fetching current user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const loggedIn = await authService.login(email, password);
    setUser(loggedIn);
    return loggedIn;
  };

  const register = async (credentials) => {
    const newUser = await authService.register(credentials);
    setUser(newUser);
    return newUser;
  };

  const loginDemo = async () => {
    const demoUser = await authService.loginDemo();
    setUser(demoUser);
    return demoUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = async (updates) => {
    const updated = await authService.updateUser(updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        loginDemo,
        logout,
        updateUser,
      }}
    >
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
