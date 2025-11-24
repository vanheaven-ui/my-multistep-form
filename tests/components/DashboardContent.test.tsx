import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest'; // import Mock type using import style
import DashboardContent from '../../app/dashboard/DashboardContent';

// ------------------------
// Global fetch mock
// ------------------------
type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
const mockFetch: Mock<FetchFn> = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

// ------------------------
// Sample submissions
// ------------------------
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

// ------------------------
// Tests
// ------------------------
describe('DashboardContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading initially and then displays submissions', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, submissions: mockSubmissions }),
    } as unknown as Response);

    render(<DashboardContent />);

    expect(screen.getByText(/loading submissions/i)).toBeInTheDocument();

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

  it('shows error if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<DashboardContent />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows error if API returns ok: false', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: false }),
    } as unknown as Response);

    render(<DashboardContent />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });
});
