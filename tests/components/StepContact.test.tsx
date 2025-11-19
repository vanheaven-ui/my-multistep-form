import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StepContact from '../../components/form/StepContact';

describe('StepContact', () => {
  const mockOnSave = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  const defaultProps = {
    defaultValues: { phone: '', address: '' }, // match the component
    onSave: mockOnSave,
    onNext: mockOnNext,
    onBack: mockOnBack,
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders phone and address inputs', () => {
    render(<StepContact {...defaultProps} />);
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
  });

  it('calls onSave and onNext on clicking Next', () => {
    render(<StepContact {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '123456' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: 'Test Street' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnSave).toHaveBeenCalledWith({
      phone: '123456',
      address: 'Test Street',
    });
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('calls onBack when Back button is clicked', () => {
    render(<StepContact {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<StepContact {...defaultProps} disabled />);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
