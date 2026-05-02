import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { User } from '../types/index';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          const userData = await api.getCurrentUser(storedToken);
          setUser({
            id: userData.id,
            email: userData.email,
            user_metadata: {
              name: userData.name,
            },
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    await api.signUp(email, password, name);
    // После успешной регистрации автоматически входим
    await signIn(email, password);
  };

  const signIn = async (email: string, password: string) => {
    const response = await api.signIn(email, password);
    const { access, refresh, user: userData } = response;
    
    console.log('✅ Login successful, storing tokens...');
    localStorage.setItem('auth_token', access);
    localStorage.setItem('refresh_token', refresh);
    setToken(access);
    setUser({
      id: userData.id,
      email: userData.email,
      user_metadata: {
        name: userData.name,
      },
    });
    console.log('✅ Tokens stored, user set:', userData.email);
  };

  const signOut = async () => {
    if (token) {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await api.signOut(token);
        }
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
