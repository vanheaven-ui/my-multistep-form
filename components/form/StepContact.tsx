'use client';
import React, { useState } from 'react';

interface StepContactProps {
  defaultValues: {
    phone: string;
    address: string;
  };
  onSave: (data: { phone: string; address: string }) => void;
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
}

const StepContact: React.FC<StepContactProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [phone, setPhone] = useState(defaultValues.phone || '');
  const [address, setAddress] = useState(defaultValues.address || '');

  const handleNext = () => {
    onSave({ phone, address });
    onNext();
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-1 rounded w-full"
        />
      </div>
      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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

export default StepContact;
