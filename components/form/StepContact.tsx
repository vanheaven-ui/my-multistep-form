'use client';
import React, { useState } from 'react';
// Correct icons from react-icons/fi
import { FiPhone, FiMapPin, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

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

// Reusing the Custom Input Field with Floating Label and Icon structure
const ContactModernInput: React.FC<{
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: React.ElementType;
  disabled: boolean;
  required?: boolean;
}> = ({
  id,
  label,
  type,
  value,
  onChange,
  Icon,
  disabled,
  required = false,
}) => {
  return (
    <div className="relative pt-6">
      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-300 pointer-events-none 
          ${
            value
              ? 'top-0 text-xs font-medium text-emerald-600'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Field with Icon */}
      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-emerald-500 transition duration-300">
        <Icon className="w-5 h-5 text-gray-400 mr-3" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={!value ? label : ''}
          className="flex-grow p-2 bg-transparent focus:outline-none text-gray-800 text-lg placeholder-gray-400"
          required={required}
        />
      </div>
    </div>
  );
};

const StepContact: React.FC<StepContactProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [phone, setPhone] = useState(defaultValues.phone || '');
  const [address, setAddress] = useState(defaultValues.address || '');

  // Validation: Address is required for this step
  const isFormValid = address.trim() !== '';

  const handleNext = () => {
    if (isFormValid) {
      onSave({ phone, address });
      onNext();
    }
  };

  return (
    // Unique Card Style: Using a subtle gray background with a strong drop shadow ("Material Design" feel)
    <div className="p-8 bg-gray-50 rounded-lg shadow-2xl shadow-gray-300/50 border border-gray-200 space-y-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold text-gray-800 border-l-4 border-emerald-500 pl-3">
        Contact Information
      </h2>
      <p className="text-gray-600">
        Please provide a phone number and current address for communication.
      </p>

      {/* Input Fields using the ContactModernInput Component */}
      <div className="space-y-6">
        <ContactModernInput
          id="phone"
          label="Phone Number (Optional)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          Icon={FiPhone} // Updated Icon
          disabled={disabled}
          required={false}
        />
        <ContactModernInput
          id="address"
          label="Full Residential Address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          Icon={FiMapPin} // Updated Icon
          disabled={disabled}
          required={true}
        />
      </div>

      {/* Button Layout: Grid for alignment and distinct styling */}
      <div
        className={`grid ${onBack ? 'grid-cols-2' : 'grid-cols-1'} gap-4 pt-6`}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={disabled}
            className="flex items-center justify-center space-x-2 px-6 py-3 text-gray-700 font-semibold border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition duration-300 disabled:opacity-50"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={disabled || !isFormValid}
          className={`flex items-center justify-center space-x-2 px-6 py-3 font-semibold rounded-xl 
            bg-emerald-600 text-white shadow-lg shadow-emerald-500/50 hover:bg-emerald-700 
            transition duration-300 
            ${disabled || !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
        >
          <span>Next Step</span>
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StepContact;
