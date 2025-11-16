"use client";
import React, { useCallback } from "react";
import type { FormSchemaType } from "../../features/multi-step-form/schemas/formSchemas";

export default function StepFiles({
  defaultValues,
  onNext,
  onBack,
  onSave,
}: {
  defaultValues?: { attachments?: { name: string; size: number }[] };
  onNext: () => void;
  onBack: () => void;
  onSave: (patch: Partial<FormSchemaType>) => void;
}) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const arr = Array.from(files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      onSave({ attachments: arr });
    },
    [onSave],
  );

  return (
    <div>
      <label className="block text-sm">Attach files</label>
      <input
        aria-label="files"
        type="file"
        multiple
        onChange={handleFileChange}
        className="mt-1"
      />
      <div className="mt-4 flex gap-2">
        <button onClick={onBack} className="px-4 py-2 border rounded">
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
