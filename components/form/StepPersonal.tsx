'use client';
import React, { useState } from 'react';
import { FiUser, FiMail, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

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

// Custom Input Field with Floating Label and Icon
const ModernInput: React.FC<{
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  Icon: React.ElementType;
  disabled: boolean;
}> = ({ id, label, type, value, onChange, Icon, disabled }) => {
  return (
    <div className="relative pt-6">
      {/* Floating Label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-300 pointer-events-none 
          ${
            value
              ? 'top-0 text-xs font-medium text-blue-600'
              : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
          }`}
      >
        {label}
      </label>

      {/* Input Field with Icon */}
      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-blue-500 transition duration-300">
        <Icon className="w-5 h-5 text-gray-400 mr-3" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
           aria-label={label}
          placeholder={!value ? label : ''} // Optional placeholder for better UX
          className="flex-grow p-2 bg-transparent focus:outline-none text-gray-800 text-lg placeholder-gray-400"
        />
      </div>
    </div>
  );
};

const StepPersonal: React.FC<StepPersonalProps> = ({
  defaultValues,
  onSave,
  onNext,
  onBack,
  disabled = false,
}) => {
  const [fullName, setFullName] = useState(defaultValues.fullName || '');
  const [email, setEmail] = useState(defaultValues.email || '');

  // Simple validation to ensure fields aren't empty before moving on
  const isFormValid = fullName.trim() !== '' && email.trim() !== '';

  const handleNext = () => {
    if (isFormValid) {
      onSave({ fullName, email });
      onNext();
    }
  };

  return (
    // Unique Card Style: Subtle Glassmorphism/Shadowed background
    <div className="p-8 bg-white/70 backdrop-blur-md border border-gray-100 rounded-3xl shadow-2xl space-y-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold text-gray-800 border-b-4 border-blue-500/50 pb-2 inline-block">
        Personal Details
      </h2>
      <p className="text-gray-600">
        Let's start with who you are. These fields are required to continue.
      </p>

      {/* Input Fields using the ModernInput Component */}
      <div className="space-y-6">
        <ModernInput
          id="fullName"
          label="Your Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          Icon={FiUser}
          disabled={disabled}
        />
        <ModernInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          Icon={FiMail}
          disabled={disabled}
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
            bg-blue-600 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-700 
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

export default StepPersonal;
