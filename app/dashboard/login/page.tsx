'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../features/hooks/multi-step-form/useAuth';

const DashboardLoginPage = () => {
  const { login, error, loading } = useAuth();
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
    router.push("/dashboard"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-sm"
      >
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 mt-2"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default DashboardLoginPage;
