import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'employee' | 'employer';
  company?: string;
  location?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: RegisterFormData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isEmployer: boolean;
  isEmployee: boolean;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: 'employee' | 'employer';
  company?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for token on load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwtDecode(token);
          const expiryDate = new Date((decoded as any).exp * 1000);
          
          if (expiryDate < new Date()) {
            localStorage.removeItem('token');
            setUser(null);
          } else {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
              setUser(JSON.parse(userInfo));
            } else {
              // If userInfo is not in localStorage, get it from API
              try {
                const res = await api.get('/api/users/profile');
                const userData = { ...res.data, token };
                localStorage.setItem('userInfo', JSON.stringify(userData));
                setUser(userData);
              } catch (err) {
                localStorage.removeItem('token');
                setUser(null);
              }
            }
          }
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Register user
  const register = async (userData: RegisterFormData) => {
    try {
      setLoading(true);
      const res = await api.post('/api/users/register', userData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await api.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      setUser(res.data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update profile
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const res = await api.put('/api/users/profile', userData);
      
      const updatedUser = { ...res.data, token: user?.token };
      
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error updating profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isEmployer: user?.role === 'employer',
        isEmployee: user?.role === 'employee'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;