'use client';
import React, { useState } from 'react';

interface StepFilesProps {
  defaultValues: {
    attachments: File[];
  };
  onSave: (data: { attachments: File[] }) => void;
  onNext: () => void;
  onBack: () => void;
  disabled?: boolean;
}

const StepFiles: React.FC<StepFilesProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [attachments, setAttachments] = useState<File[]>(
    defaultValues.attachments || [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments(files);
    onSave({ attachments: files });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="attachments" className="block mb-1 font-medium">
          Attachments
        </label>
        <input
          id="attachments"
          type="file"
          multiple
          value={undefined} // required to prevent React warning
          onChange={handleChange}
          className="border p-1 rounded w-full"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2 mt-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={disabled}
            className="px-3 py-2 border rounded"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepFiles;
