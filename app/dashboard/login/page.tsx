'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --- API Authentication Logic ---
      const res = await fetch('/api/dashboard/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        // Successful login: The HTTP-only cookie is set by the server.
        // Redirect the user to the dashboard.
        router.push('/dashboard');
      } else {
        // Handle API errors (e.g., Incorrect password/email)
        const errMsg =
          result.error || 'Login failed. Please check your network.';
        setError(errMsg);
      }
    } catch (err) {
      // Handle network errors or unexpected exceptions
      console.error('Login request failed:', err);
      setError('A critical error occurred during login. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 1. Left Side: Unique Trust/Branding Visual (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 dark:bg-gray-950 items-center justify-center p-12 relative">
        <div className="text-white text-center z-10">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto text-lg">
            Access the data management and analytics dashboard. Your security is
            our priority.
          </p>
          {/* Unique Element: Abstract Pattern or Icon */}
          <div className="mt-8 text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <path d="M12 2a10 10 0 0 0-7.35 16.7l.88-1.57a8 8 0 0 1 5.37-2.13 8 8 0 0 1 5.37 2.13l.88 1.57A10 10 0 0 0 12 2z" />
              <path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <circle cx="12" cy="19" r="2" />
              <path d="M10 17h4" />
            </svg>
          </div>
        </div>
        {/* Subtle Background Effect */}
        <div className="absolute inset-0 bg-blue-500/10 opacity-30 animate-pulse-slow"></div>
      </div>

      {/* 2. Right Side: Login Form Container (Always Visible) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white dark:bg-gray-800">
        {/* === NEW: Go Back Link === */}
        <div className="w-full max-w-md mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Go Back to Home
          </Link>
        </div>
        {/* ======================= */}

        {/* Floating Form Card */}
        <div className="w-full max-w-md bg-white dark:bg-gray-700 p-8 sm:p-10 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-600/50 -mt-8">
          {' '}
          {/* Adjusted margin to account for new element */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              System Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter your credentials to proceed.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input: Email/Username */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Input: Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition duration-150"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.087 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>

            {/* Customization Hook: Forgot Password/External Links */}
            <div className="text-center">
              <Link
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
