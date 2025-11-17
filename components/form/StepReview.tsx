'use client';

import React, { useState } from 'react';
import type { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

interface StepReviewProps {
  data: FormSchemaType;
  onBack: () => void;
  onSubmit: (data: FormSchemaType) => void;
}

export default function StepReview({
  data,
  onBack,
  onSubmit,
}: StepReviewProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Optimistic UI: immediately show success
      setSuccess(true);

      // Make API call
      const res = await fetch('/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      onSubmit(data); // propagate to parent hook

      // clear localStorage if needed
      localStorage.removeItem('multi_step_form_v1');
    } catch (err: unknown) {
      setSuccess(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review your submission</h2>

      <div className="space-y-2 border p-4 rounded bg-gray-50">
        <div>
          <strong>Full Name:</strong> {data.fullName}
        </div>
        <div>
          <strong>Email:</strong> {data.email}
        </div>
        {data.phone && (
          <div>
            <strong>Phone:</strong> {data.phone}
          </div>
        )}
        {data.address && (
          <div>
            <strong>Address:</strong> {data.address}
          </div>
        )}
        {data.attachments && data.attachments.length > 0 && (
          <div>
            <strong>Attachments:</strong>
            <ul className="list-disc pl-5">
              {data.attachments.map((file, i) => (
                <li key={i}>
                  {file.name} ({file.size} bytes)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Submission successful!</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={submitting}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
