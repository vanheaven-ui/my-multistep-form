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
  it('renders file input', () => {
    render(<StepFiles {...defaultProps} />);
    expect(screen.getByLabelText(/attachments/i)).toBeInTheDocument();
  });

  it('calls onSave when files are selected', () => {
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/attachments/i) as HTMLInputElement;

    const file = new File(['file contents'], 'test-file.txt', {
      type: 'text/plain',
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(defaultProps.onSave).toHaveBeenCalledWith({ attachments: [file] });
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
