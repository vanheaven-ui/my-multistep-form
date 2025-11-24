import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';

vi.mock('../../features/hooks/multi-step-form/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuth } from '../../features/hooks/multi-step-form/useAuth';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading when auth is loading', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      loading: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Secret Content</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText('Secret Content')).toBeInTheDocument();
  });

  it('renders login fallback when NOT authenticated', () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
    );

    expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
  });
});
