'use client';
import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface UseAuthReturn {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/dashboard/check');
        setIsAuthenticated(res.data.ok);
      } catch (_err) {
        // Using `_err` prevents unused-var lint error
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/api/dashboard/login', { password });
      if (res.data.ok) {
        setIsAuthenticated(true);
      } else {
        setError(res.data.error || 'Login failed');
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string }>;
      setError(
        axiosErr.response?.data?.error || 'Server error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post('/api/dashboard/logout');
      setIsAuthenticated(false);
    } catch (_err) {
      console.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, logout };
}
