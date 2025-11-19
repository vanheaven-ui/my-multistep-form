import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StepReview from '../../components/form/StepReview';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

describe('StepReview', () => {
  const mockOnSubmit = vi.fn();
  const mockOnBack = vi.fn();

  const defaultData: FormSchemaType = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123456',
    address: '123 Test Street',
    attachments: [],
  };

  const defaultProps = {
    data: defaultData,
    onBack: mockOnBack,
    onSubmit: mockOnSubmit,
    disabled: false,
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders review data', () => {
    render(<StepReview {...defaultProps} />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();
    expect(screen.getByText(/123 Test Street/)).toBeInTheDocument();
  });

  it('calls onSubmit when Submit button is clicked', () => {
    render(<StepReview {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith(defaultData);
  });

  it('calls onBack when Back button is clicked', () => {
    render(<StepReview {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<StepReview {...defaultProps} disabled />);
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });
});
