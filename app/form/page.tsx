'use client';
import React, { useState } from 'react';
import StepPersonal from '../../components/form/StepPersonal';
import StepContact from '../../components/form/StepContact';
import StepFiles from '../../components/form/StepFiles';
import StepReview from '../../components/form/StepReview';
import { useMultiStepForm } from '../../features/hooks/multi-step-form/useMultiStepForm';
import { FormStep } from '../../features/hooks/multi-step-form/types';
import Stepper from '../../components/form/Stepper';
import StepContainer from '../../components/layout/StepContainer';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

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
      const formData = new FormData();
      formData.append('fullName', payload.fullName);
      formData.append('email', payload.email);
      if (payload.phone) formData.append('phone', payload.phone);
      if (payload.address) formData.append('address', payload.address);

      payload.attachments?.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await fetch('/api/form', { method: 'POST', body: formData });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || 'Submission failed');

      // Reset form after successful submission
      localStorage.removeItem('multi_step_form_v1');
      reset();
      goTo(FormStep.Personal);
      setSuccess(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Multi-step form (integrated)</h1>
      <Stepper step={step} total={totalSteps} />

      <StepContainer>
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

        {step === FormStep.Review && (
          <StepReview
            data={data}
            onBack={back}
            onSubmit={handleSubmit}
            disabled={loading}
          />
        )}
      </StepContainer>

      {loading && (
        <p className="text-blue-600 mt-4" role="status">
          Submitting form...
        </p>
      )}
      {error && (
        <p className="text-red-600 mt-4" role="alert">
          Error: {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 mt-4" role="alert">
          Form submitted successfully!
        </p>
      )}
    </main>
  );
}

export default FormPage;
