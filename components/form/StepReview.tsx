'use client';
import React from 'react';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

interface StepReviewProps {
  data: FormSchemaType;
  onSubmit: (payload: FormSchemaType) => void;
  onBack: () => void;
  disabled?: boolean;
}

const StepReview: React.FC<StepReviewProps> = ({
  data,
  onSubmit,
  onBack,
  disabled = false,
}) => {
  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Review your data</h2>
      <div>
        <p>
          <strong>Full Name:</strong> {data.fullName}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Phone:</strong> {data.phone}
        </p>
        <p>
          <strong>Address:</strong> {data.address}
        </p>
        <p>
          <strong>Attachments:</strong> {data?.attachments?.length} file(s)
          selected
        </p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="px-3 py-2 border rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default StepReview;
