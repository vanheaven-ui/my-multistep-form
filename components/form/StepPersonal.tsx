'use client';
import React, { useState } from 'react';

interface StepPersonalProps {
  defaultValues: {
    fullName: string;
    email: string;
  };
  onSave: (data: { fullName: string; email: string }) => void;
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
}

const StepPersonal: React.FC<StepPersonalProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [fullName, setFullName] = useState(defaultValues.fullName || '');
  const [email, setEmail] = useState(defaultValues.email || '');

  const handleNext = () => {
    onSave({ fullName, email });
    onNext();
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-1 rounded w-full"
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
          onClick={handleNext}
          disabled={disabled}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepPersonal;
