import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password);
      if (response.success) {
        setUser(response.user);
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear user data regardless of API response
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Clear any other user-related data
      localStorage.removeItem('cart');
      localStorage.removeItem('session_id');
    }
  };

  const checkAuth = async (): Promise<void> => {
    try {
      // Check if we have a token in localStorage first
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Try to validate token with backend
        const response = await api.getCurrentUser();
        if (response.success) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
        } else {
          // Token is invalid, clear everything
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } else {
        // No token, user is not authenticated
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Return loading state while checking authentication
  if (isLoading) {
    return (
      <AuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login,
        logout,
        checkAuth
      }}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};
