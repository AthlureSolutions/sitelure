// packages/frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUser(token);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.token);
  };

  const register = async (email: string, password: string) => {
    await axios.post('/api/auth/register', { email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
