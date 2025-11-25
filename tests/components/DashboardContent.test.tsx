import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';
import DashboardContent from '../../app/dashboard/DashboardContent';

type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
const mockFetch: Mock<FetchFn> = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

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

describe('DashboardContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders submissions after skeleton loading', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, submissions: mockSubmissions }),
    } as unknown as Response);

    render(<DashboardContent />);

    // 1️⃣ Check that the skeleton is rendered initially
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();

    // 2️⃣ Wait for actual dashboard content (wrapped in waitFor to handle act warnings)
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /analytics dashboard/i }),
      ).toBeInTheDocument(),
    );

    // 3️⃣ Verify table content
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('123 Street')).toBeInTheDocument();

    // 4️⃣ Verify attachment link
    const attachmentLink = screen.getByText('file1.pdf');
    expect(attachmentLink).toHaveAttribute(
      'href',
      'https://example.com/file1.pdf',
    );
  });

  it('renders "No submissions found yet" when submissions array is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true, submissions: [] }),
    } as unknown as Response);

    render(<DashboardContent />);

    await waitFor(() =>
      expect(screen.getByText(/no submissions found yet/i)).toBeInTheDocument(),
    );
  });

  it('shows error if fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<DashboardContent />);

    // Wait for error alert to appear
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/failed to fetch submissions/i);
    });
  });

  it('shows error if API returns ok: false', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: false }),
    } as unknown as Response);

    render(<DashboardContent />);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/failed to fetch submissions/i);
    });
  });
});
