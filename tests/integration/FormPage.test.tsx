import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPage from '../../app/form/page';
import { vi } from 'vitest';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('FormPage Integration', () => {
  const fillPersonalStep = () => {
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
  };

  const fillContactStep = () => {
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: 'Test Street' },
    });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
  };

  const fillFilesStep = () => {
    // Optional: mock adding a file if StepFiles requires it
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
  };

  it('submits the form successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: true }),
    });

    render(<FormPage />);

    fillPersonalStep();
    fillContactStep();
    fillFilesStep();

    // Now we are on Review step
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /form submitted successfully/i,
      );
    });
  });

  it('handles submission failure', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: false, error: 'Submission failed' }),
    });

    render(<FormPage />);

    fillPersonalStep();
    fillContactStep();
    fillFilesStep();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/submission failed/i);
    });
  });
});
