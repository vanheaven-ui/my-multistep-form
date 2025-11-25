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

// Helper: create valid file
const createValidFile = () => {
  return new File(['file contents'], 'test-file.png', { type: 'image/png' });
};

describe('FormPage Integration', () => {
  const fillPersonalStep = async () => {
    await waitFor(() => screen.getByLabelText(/your full name/i));

    fireEvent.change(screen.getByLabelText(/your full name/i), {
      target: { value: 'Alice' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alice@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    await waitFor(() => screen.getByLabelText(/phone/i));
  };

  const fillContactStep = async () => {
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: 'Test Street' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    await waitFor(() => screen.getByText(/document upload/i));
  };

  const fillFilesStep = async () => {
    const fileInput = screen.getByLabelText(
      /drag & drop files here/i,
    ) as HTMLInputElement;
    const file = createValidFile();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() =>
      expect(screen.getByText('test-file.png')).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole('button', { name: /next step/i }));

    await waitFor(() => screen.getByText(/final review & submit/i));
  };

  it('submits the form successfully', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => ({ ok: true }) });

    render(<FormPage />);

    await fillPersonalStep();
    await fillContactStep();
    await fillFilesStep();

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /form submitted successfully!/i,
      );
    });
  });

  it('handles submission failure', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ ok: false, error: 'Submission failed' }),
    });

    render(<FormPage />);

    await fillPersonalStep();
    await fillContactStep();
    await fillFilesStep();

    fireEvent.click(screen.getByRole('button', { name: /submit form/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/submission failed/i);
    });
  });
});
