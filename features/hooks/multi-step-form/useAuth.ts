'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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
        const res = await axios.get('/api/dashboard/check'); // We'll create this API next
        setIsAuthenticated(res.data.ok);
      } catch (err) {
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
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Server error');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await axios.post('/api/dashboard/logout');
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { isAuthenticated, loading, error, login, logout };
}
