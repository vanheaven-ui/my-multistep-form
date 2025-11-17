'use client';
import React, { useState } from "react";
import { FormSchemaType } from "../../features/multi-step-form/schemas/formSchemas";

interface StepFilesProps {
  defaultValues: Pick<FormSchemaType, "attachments">;
  onNext: () => void;
  onBack: () => void;
  onSave: (payload: Partial<FormSchemaType>) => void;
}

export default function StepFiles({
  defaultValues,
  onNext,
  onBack,
  onSave,
}: StepFilesProps) {
  // keep state as FormSchemaType attachments
  const [attachments, setAttachments] = useState<{ name: string; size: number }[]>(
    defaultValues.attachments || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files).map((f) => ({
      name: f.name,
      size: f.size,
    }));

    setAttachments(filesArray);
  };

  const handleNext = () => {
    onSave({ attachments });
    onNext();
  };

  return (
    <div className="space-y-4">
      <input type="file" multiple onChange={handleChange} />
      {attachments.length > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
          {attachments.map((f, idx) => (
            <li key={idx}>
              {f.name} ({(f.size / 1024).toFixed(1)} KB)
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-2 border rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
