import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StepPersonal from '../../components/form/StepPersonal';

describe('StepPersonal', () => {
  const mockOnSave = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();

  const defaultProps = {
    defaultValues: { fullName: '', email: '' }, // updated prop
    onSave: mockOnSave,
    onNext: mockOnNext,
    onBack: mockOnBack,
    disabled: false,
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders fullName and email inputs', () => {
    render(<StepPersonal {...defaultProps} />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('calls onSave and onNext on clicking Next', () => {
    render(<StepPersonal {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(mockOnSave).toHaveBeenCalledWith({
      fullName: 'John Doe',
      email: 'john@example.com',
    });
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('calls onBack when Back button is clicked', () => {
    render(<StepPersonal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<StepPersonal {...defaultProps} disabled />);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });
});
