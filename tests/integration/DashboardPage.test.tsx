import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import React from 'react';

// Mock the useAuth hook
vi.mock('../../features/hooks/multi-step-form/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

import { useAuth } from '../../features/hooks/multi-step-form/useAuth';
import DashboardPage from '../../app/dashboard/page';

// Sample submissions data
const mockSubmissions = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123456789',
    address: '123 Street',
    attachments: [
      { id: 'a1', name: 'file1.pdf', url: 'https://example.com/file1.pdf' },
    ],
  },
];

describe('DashboardPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProtectedRoute fallback when not authenticated', async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
    });

    render(<DashboardPage />);

    // Check for the fallback text from ProtectedRoute
    await waitFor(() => {
      expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
    });
  });

  it('fetches and displays submissions when authenticated', async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
    });

    // Mock global fetch for submissions
    (global.fetch as any) = vi.fn().mockResolvedValue({
      json: async () => ({ ok: true, submissions: mockSubmissions }),
    });

    render(<DashboardPage />);

    // Wait for the dashboard header
    await waitFor(() =>
      expect(screen.getByText('Dashboard')).toBeInTheDocument(),
    );

    // Check submission data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('123 Street')).toBeInTheDocument();

    // Check attachment link
    const attachmentLink = screen.getByText('file1.pdf');
    expect(attachmentLink).toHaveAttribute(
      'href',
      'https://example.com/file1.pdf',
    );
  });

  it('shows error if submissions fetch fails', async () => {
    (useAuth as Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      error: null,
    });

    // Mock failed fetch
    (global.fetch as any) = vi.fn().mockResolvedValue({
      json: async () => ({ ok: false }),
    });

    render(<DashboardPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });
});
