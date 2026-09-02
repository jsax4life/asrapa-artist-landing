import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, UserData } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authenticated = authService.isAuthenticated();
        const userData = authService.getUserData();
        
        setIsAuthenticated(authenticated);
        setUser(userData);
      } catch (error) {
        console.error('Error initializing auth state:', error);
        // Clear any corrupted auth data
        authService.clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth events
  useEffect(() => {
    const handleLogin = (event: CustomEvent) => {
      setIsAuthenticated(true);
      setUser(event.detail.userData);
    };

    const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    const handleTokenUpdate = () => {
      // Token was updated, refresh user data if needed
      const userData = authService.getUserData();
      setUser(userData);
    };

    // Add event listeners
    window.addEventListener('auth:login', handleLogin as EventListener);
    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('auth:token-updated', handleTokenUpdate);

    // Cleanup
    return () => {
      window.removeEventListener('auth:login', handleLogin as EventListener);
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('auth:token-updated', handleTokenUpdate);
    };
  }, []);

  const login = (userData: UserData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = (userData: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update stored user data
      try {
        sessionStorage.setItem('asra_user_data', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
