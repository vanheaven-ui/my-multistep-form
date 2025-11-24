import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';
import DashboardPage from '../../app/dashboard/page';
import { useAuth } from '../../features/hooks/multi-step-form/useAuth';

// --- Sample submissions ---
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

// --- Mock useAuth hook ---
vi.mock('../../features/hooks/multi-step-form/useAuth', () => ({
  useAuth: vi.fn(),
}));

// --- Mock next/navigation ---
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// --- Mock fetch globally ---
type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
const fetchMock: Mock<FetchFn> = vi.fn();
global.fetch = fetchMock as unknown as typeof fetch;

// --- Type-safe mock return for useAuth ---
interface UseAuthMock {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

describe('DashboardPage Integration', () => {
  const useAuthMock = useAuth as Mock<() => UseAuthMock>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProtectedRoute fallback when not authenticated', async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      login: async () => {},
      logout: async () => {},
      error: null,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/checking authentication/i)).toBeInTheDocument();
    });
  });

  it('fetches and displays submissions when authenticated', async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: async () => {},
      logout: async () => {},
      error: null,
    });

    // Mock fetch response
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, submissions: mockSubmissions }),
    } as unknown as Response);

    render(<DashboardPage />);

    await waitFor(() =>
      expect(screen.getByText('Dashboard')).toBeInTheDocument(),
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('123 Street')).toBeInTheDocument();

    const attachmentLink = screen.getByText('file1.pdf');
    expect(attachmentLink).toHaveAttribute(
      'href',
      'https://example.com/file1.pdf',
    );
  });

  it('shows error if submissions fetch fails', async () => {
    useAuthMock.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      login: async () => {},
      logout: async () => {},
      error: null,
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: false }),
    } as unknown as Response);

    render(<DashboardPage />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });
});
