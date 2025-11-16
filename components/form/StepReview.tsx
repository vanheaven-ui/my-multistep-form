"use client";
import React from "react";
import type { FormSchemaType } from "../../features/multi-step-form/schemas/formSchemas";

export default function StepReview({
  data,
  onBack,
  onSubmit,
}: {
  data: Partial<FormSchemaType>;
  onBack: () => void;
  onSubmit: (payload: Partial<FormSchemaType>) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Review</h2>
      <pre className="bg-slate-50 p-3 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      <div className="mt-4 flex gap-2">
        <button onClick={onBack} className="px-4 py-2 border rounded">
          Back
        </button>
        <button
          onClick={() => onSubmit(data)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
