/**
 * AUTH CONTEXT
 * ============
 * 
 * Gestisce lo stato di autenticazione dell'applicazione.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { verifyAccessCode, saveAuthState, getAuthState, logout as logoutUtil } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Controlla lo stato di autenticazione al caricamento
  useEffect(() => {
    const authState = getAuthState();
    setIsAuthenticated(authState);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (code: string): Promise<boolean> => {
    const isValid = await verifyAccessCode(code);
    if (isValid) {
      setIsAuthenticated(true);
      saveAuthState(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    logoutUtil();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
