import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import DashboardContent from '../../app/dashboard/DashboardContent';

// Mock global fetch
global.fetch = vi.fn();

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

  it('renders loading initially and then displays submissions', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ ok: true, submissions: mockSubmissions }),
    });

    render(<DashboardContent />);

    // Initially loading
    expect(screen.getByText(/loading submissions/i)).toBeInTheDocument();

    // Wait for submissions to render
    await waitFor(() =>
      expect(screen.getByText('Dashboard')).toBeInTheDocument(),
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('123 Street')).toBeInTheDocument();

    // Attachment link
    const attachmentLink = screen.getByText('file1.pdf');
    expect(attachmentLink).toHaveAttribute(
      'href',
      'https://example.com/file1.pdf',
    );
  });

  it('shows error if fetch fails', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Fetch failed'));

    render(<DashboardContent />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });

  it('shows error if API returns ok: false', async () => {
    (fetch as any).mockResolvedValueOnce({
      json: async () => ({ ok: false }),
    });

    render(<DashboardContent />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to fetch submissions/i),
      ).toBeInTheDocument(),
    );
  });
});
