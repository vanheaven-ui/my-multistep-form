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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'application/pdf'];

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

    // Filter files by allowed types and size
    const validFiles = files.filter(
      (file) => file.size <= MAX_FILE_SIZE && ALLOWED_TYPES.includes(file.type),
    );

    // Append new files to existing attachments
    const newAttachments = [...attachments, ...validFiles];
    setAttachments(newAttachments);
    onSave({ attachments: newAttachments });
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

        {attachments.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {attachments.map((file) => (
              <li key={file.name}>
                {file.name} ({Math.round(file.size / 1024)} KB)
              </li>
            ))}
          </ul>
        )}
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
