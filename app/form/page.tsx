'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import StepPersonal from '../../components/form/StepPersonal';
import StepReview from '../../components/form/StepReview';
import { useMultiStepForm } from '../../features/hooks/multi-step-form/useMultiStepForm';
import { FormStep } from '../../features/hooks/multi-step-form/types';
import Stepper from '../../components/form/Stepper';
import StepContainer from '../../components/layout/StepContainer';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';
import StepContact from '../../components/form/StepContact';
import StepFiles from '../../components/form/StepFiles';
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// Define step titles for the modernized Stepper
const stepTitles = [
  'Personal Info',
  'Contact Details',
  'Attachments',
  'Review & Submit',
];

// --- Modern Alert Component for Notifications ---
interface AlertProps {
  type: 'success' | 'error' | 'loading';
  message: string;
  onClose?: () => void;
  role: string;
}

const ModernAlert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  role,
}) => {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';
  let Icon = FiAlertTriangle;

  if (type === 'success') {
    bgColor = 'bg-emerald-100';
    borderColor = 'border-emerald-500';
    textColor = 'text-emerald-800';
    Icon = FiCheckCircle;
  } else if (type === 'error') {
    bgColor = 'bg-red-100';
    borderColor = 'border-red-500';
    textColor = 'text-red-800';
    Icon = FiAlertTriangle;
  } else if (type === 'loading') {
    bgColor = 'bg-blue-100';
    borderColor = 'border-blue-500';
    textColor = 'text-blue-800';
    // Use a simple text spinner or no icon for loading to keep it clean
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl border-l-4 ${bgColor} ${borderColor} transition-transform duration-300 ease-out transform ${message ? 'translate-x-0' : 'translate-x-[150%]'}`}
      role={role}
    >
      <div className="flex items-center space-x-3">
        {type !== 'loading' && (
          <Icon className={`w-6 h-6 ${textColor} flex-shrink-0`} />
        )}
        {type === 'loading' && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        )}
        <p className={`font-semibold ${textColor}`}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${textColor} opacity-70 hover:opacity-100 transition`}
          >
            <FiXCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

function FormPage() {
  const { step, totalSteps, next, back, data, setData, goTo, reset } =
    useMultiStepForm<FormSchemaType>({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      attachments: [],
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (payload: FormSchemaType) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // API Submission logic (unchanged)
      const formData = new FormData();
      formData.append('fullName', payload.fullName);
      formData.append('email', payload.email);
      if (payload.phone) formData.append('phone', payload.phone);
      if (payload.address) formData.append('address', payload.address);

      payload.attachments?.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await fetch('/api/form', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!result.ok) throw new Error(result.error || 'Submission failed');

      // Reset form after successful submission
      localStorage.removeItem('multi_step_form_v1');
      reset();
      goTo(FormStep.Personal);
      setSuccess(true);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-emerald-300 pb-2">
          New Application Form
        </h1>

        {/* --- Modern Navigation Buttons --- */}
        <div className="flex space-x-4 mb-8">
          <Link href="/" passHref legacyBehavior>
            <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 shadow-sm transition duration-150 ease-in-out">
              <span role="img" aria-label="home">
                🏠
              </span>
              <span>Go to Home</span>
            </button>
          </Link>

          <Link href="/dashboard" passHref legacyBehavior>
            <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out">
              <span role="img" aria-label="dashboard">
                ⚙️
              </span>
              <span>View Dashboard</span>
            </button>
          </Link>
        </div>

        {/* --- Stepper with Titles --- */}
        <div className="mb-8">
          <Stepper
            step={step}
            total={totalSteps}
            stepTitles={stepTitles}
            // Assuming useMultiStepForm exposes a goTo function for clicking steps
            onStepClick={goTo}
          />
        </div>

        <StepContainer>
          {/* Step 1: Personal */}
          {step === FormStep.Personal && (
            <StepPersonal
              defaultValues={{
                fullName: data.fullName || '',
                email: data.email || '',
              }}
              onNext={next}
              onSave={(vals) => setData({ ...data, ...vals })}
              disabled={loading}
            />
          )}

          {/* Step 2: Contact */}
          {step === FormStep.Contact && (
            <StepContact
              defaultValues={{
                phone: data.phone || '',
                address: data.address || '',
              }}
              onBack={back}
              onNext={next}
              onSave={(vals) => setData({ ...data, ...vals })}
              disabled={loading}
            />
          )}

          {/* Step 3: Files */}
          {step === FormStep.Files && (
            <StepFiles
              defaultValues={{
                attachments: data.attachments || [],
              }}
              onBack={back}
              onNext={next}
              onSave={(vals) => setData({ ...data, ...vals })}
              disabled={loading}
            />
          )}

          {/* Step 4: Review */}
          {step === FormStep.Review && (
            <StepReview
              data={data}
              onBack={back}
              onSubmit={handleSubmit}
              disabled={loading}
            />
          )}
        </StepContainer>
      </main>

      {/* --- Modern Notifications (Fixed Position) --- */}
      {loading && (
        <ModernAlert
          type="loading"
          message="Submitting form..."
          role="status"
        />
      )}

      {error && (
        <ModernAlert
          type="error"
          message={`Error: ${error}`}
          onClose={() => setError(null)}
          role="alert"
        />
      )}

      {success && (
        <ModernAlert
          type="success"
          // Test compatibility: ensures the text content matches the original test
          message="Form submitted successfully!"
          onClose={() => setSuccess(false)}
          role="alert"
        />
      )}
    </>
  );
}

export default FormPage;
