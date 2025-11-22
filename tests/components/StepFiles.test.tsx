import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StepFiles from '../../components/form/StepFiles';
import { vi } from 'vitest';

const defaultProps = {
  defaultValues: { attachments: [] },
  onSave: vi.fn(),
  onNext: vi.fn(),
  onBack: vi.fn(),
  disabled: false,
};

describe('StepFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file input', () => {
    render(<StepFiles {...defaultProps} />);
    expect(screen.getByLabelText(/attachments/i)).toBeInTheDocument();
  });

  it('calls onSave when valid files are selected', () => {
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/attachments/i) as HTMLInputElement;

    const file = new File(['file contents'], 'test-file.png', {
      type: 'image/png', // valid type
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(defaultProps.onSave).toHaveBeenCalledWith({ attachments: [file] });
  });

  it('ignores files with invalid type or size', () => {
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/attachments/i) as HTMLInputElement;

    const invalidTypeFile = new File(['data'], 'bad-file.txt', {
      type: 'text/plain',
    });
    const oversizedFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      'big-file.png',
      {
        type: 'image/png',
      },
    );

    fireEvent.change(fileInput, {
      target: { files: [invalidTypeFile, oversizedFile] },
    });

    // onSave should be called with empty array because all files are invalid
    expect(defaultProps.onSave).toHaveBeenCalledWith({ attachments: [] });
  });

  it('calls onNext and onBack correctly', () => {
    render(<StepFiles {...defaultProps} />);
    const nextButton = screen.getByText(/next/i);
    const backButton = screen.getByText(/back/i);

    fireEvent.click(nextButton);
    expect(defaultProps.onNext).toHaveBeenCalled();

    fireEvent.click(backButton);
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
});
