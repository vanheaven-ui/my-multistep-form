import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StepFiles from '../../components/form/StepFiles';

describe('StepFiles', () => {
  const defaultProps = {
    defaultValues: { attachments: [] },
    onSave: vi.fn(),
    onNext: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file input', () => {
    render(<StepFiles {...defaultProps} />);
    expect(
      screen.getByLabelText(/Drag & Drop files here/i),
    ).toBeInTheDocument();
  });

  it('calls onSave when valid files are selected via input', () => {
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/Drag & Drop files here/i);

    const validFile = new File(['file content'], 'test.png', {
      type: 'image/png',
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(defaultProps.onSave).toHaveBeenCalledWith({
      attachments: [validFile],
    });
  });

  it('calls onSave when valid files are dropped via drag-and-drop', () => {
    render(<StepFiles {...defaultProps} />);
    const dropArea = screen.getByText(
      /Drag & Drop files here or/i,
    ).parentElement;

    const validFile = new File(['file content'], 'dragged.pdf', {
      type: 'application/pdf',
    });

    fireEvent.drop(dropArea!, {
      dataTransfer: {
        files: [validFile],
        types: ['Files'],
      },
    });

    expect(defaultProps.onSave).toHaveBeenCalledWith({
      attachments: [validFile],
    });
  });

  it('sets error for invalid files without calling onSave', () => {
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/Drag & Drop files here/i);

    // Large file > 5MB
    const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    // Invalid type
    const invalidTypeFile = new File(['content'], 'file.txt', {
      type: 'text/plain',
    });

    fireEvent.change(fileInput, {
      target: { files: [largeFile, invalidTypeFile] },
    });

    // onSave should NOT be called
    expect(defaultProps.onSave).not.toHaveBeenCalled();

    // Alert should be shown with proper error
    expect(screen.getByRole('alert')).toHaveTextContent(
      /exceeds the 5.00 MB size limit|unsupported type/i,
    );
  });

  it('removes files correctly', () => {
    const file = new File(['content'], 'file.pdf', { type: 'application/pdf' });
    render(<StepFiles {...defaultProps} />);
    const fileInput = screen.getByLabelText(/Drag & Drop files here/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // File is added
    expect(defaultProps.onSave).toHaveBeenCalledWith({ attachments: [file] });

    // Remove button
    const removeButton = screen.getByTitle(`Remove ${file.name}`);
    fireEvent.click(removeButton);

    expect(defaultProps.onSave).toHaveBeenCalledWith({ attachments: [] });
  });

  it('calls onNext and onBack correctly', () => {
    // Provide a file so Next button is enabled
    const defaultPropsWithFile = {
      ...defaultProps,
      defaultValues: {
        attachments: [
          new File(['content'], 'file.pdf', { type: 'application/pdf' }),
        ],
      },
    };

    render(<StepFiles {...defaultPropsWithFile} />);

    fireEvent.click(screen.getByText(/Next Step/i));
    fireEvent.click(screen.getByText(/Back/i));

    expect(defaultProps.onNext).toHaveBeenCalled();
    expect(defaultProps.onBack).toHaveBeenCalled();
  });
});
