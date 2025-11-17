'use client';
import React from 'react';
import StepPersonal from '../../components/form/StepPersonal';
import StepContact from '../../components/form/StepContact';
import StepFiles from '../../components/form/StepFiles';
import StepReview from '../../components/form/StepReview';
import { useMultiStepForm } from '../../features/hooks/multi-step-form/useMultiStepForm';
import { FormStep } from '../../features/hooks/multi-step-form/types';
import Stepper from '../../components/form/Stepper';
import StepContainer from '../../components/layout/StepContainer';
import { FormSchemaType } from '../../features/multi-step-form/schemas/formSchemas';

export default function FormPage() {
  const { step, totalSteps, next, back, data, setData, goTo } =
    useMultiStepForm<FormSchemaType>({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      attachments: [], // File[]
    });

  const handleNextFromPersonal = () => next();

  const handleSubmit = async (payload: FormSchemaType): Promise<void> => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append('fullName', payload.fullName);
      formData.append('email', payload.email);
      formData.append('phone', payload.phone || '');
      formData.append('address', payload.address || '');

      // Add attachments safely
      payload.attachments?.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/form', {
        method: 'POST',
        body: formData,
      });

      const result: { ok: boolean; error?: string } = await response.json();
      console.log('Submission result:', result);

      if (!result.ok) throw new Error(result.error || 'Submission failed');

      localStorage.removeItem('multi_step_form_v1');
      goTo(FormStep.Personal);
      alert('Form submitted successfully!');
    } catch (error) {
      // Proper type guard instead of `any`
      const errMsg =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(error);
      alert('Submit failed: ' + errMsg);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Multi-step form (integrated)</h1>
      <Stepper step={step} total={totalSteps} />
      <StepContainer>
        {step === FormStep.Personal && (
          <StepPersonal
            defaultValues={data}
            onNext={handleNextFromPersonal}
            onSave={setData}
          />
        )}
        {step === FormStep.Contact && (
          <StepContact
            defaultValues={data}
            onBack={back}
            onNext={next}
            onSave={setData}
          />
        )}
        {step === FormStep.Files && (
          <StepFiles
            defaultValues={{ attachments: data.attachments }}
            onBack={back}
            onNext={next}
            onSave={setData}
          />
        )}
        {step === FormStep.Review && (
          <StepReview data={data} onBack={back} onSubmit={handleSubmit} />
        )}
      </StepContainer>
    </main>
  );
}
