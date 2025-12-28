/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken, removeToken, isAuthenticated, decodeToken } from '../utils/jwt';

// User interface representing decoded JWT payload
interface User {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Auth context value interface
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with undefined default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = () => {
      if (isAuthenticated()) {
        const token = getToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            setUser({
              username: decoded.username as string,
              email: decoded.email as string | undefined,
              firstName: decoded.first_name as string | undefined,
              lastName: decoded.last_name as string | undefined,
            });
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function - stores token and updates user state
   * @param token - JWT token received from backend
   */
  const login = (token: string) => {
    setToken(token);
    const decoded = decodeToken(token);
    if (decoded) {
      setUser({
        username: decoded.username as string,
        email: decoded.email as string | undefined,
        firstName: decoded.first_name as string | undefined,
        lastName: decoded.last_name as string | undefined,
      });
    }
  };

  /**
   * Logout function - removes token and clears user state
   */
  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns AuthContextType
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

