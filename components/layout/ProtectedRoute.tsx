'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../features/hooks/multi-step-form/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Helper Component for the Modern Loading State
const LoadingSpinner: React.FC = () => (
  // Full screen overlay, centered content
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      {/* Minimalist Spinner */}
      <div
        className="w-8 h-8 border-4 border-t-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mb-4"
        role="status"
        aria-label="Loading"
      ></div>

      <p className="text-gray-700 dark:text-gray-300 font-semibold tracking-wider">
        Checking authentication...
      </p>
    </div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/dashboard/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || (!isAuthenticated && !loading)) {
    // We return the full screen component when loading OR when finished loading but NOT authenticated.
    // This allows the test to still find the "Checking authentication..." text.
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
