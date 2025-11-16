"use client";
import React from "react";

import StepPersonal from "../../components/form/StepPersonal";
import StepContact from "../../components/form/StepContact";
import StepFiles from "../../components/form/StepFiles";
import StepReview from "../../components/form/StepReview";
import { useMultiStepForm } from "../../features/hooks/multi-step-form/useMultiStepForm";
import { FormStep } from "../../features/hooks/multi-step-form/types";
import Stepper from "../../components/form/Stepper";
import StepContainer from "../../components/layout/StepContainer";

export default function FormPage() {
  const { step, totalSteps, next, back, data, setData, goTo } =
    useMultiStepForm();

  const handleNextFromPersonal = (payload: any) => {
    // data already saved in setData by child; we still call next to move forward
    next();
  };

  const handleSubmit = async (payload: any) => {
    // TODO: call API `/api/form` — for now just clear and alert
    try {
      // optimistic submit placeholder
      alert("Submitted — check console");
      console.log("submit payload", payload);
      // clear storage / reset if you want
      localStorage.removeItem("multi_step_form_v1");
      goTo(FormStep.Personal);
    } catch (e) {
      console.error(e);
      alert("Submit failed (stub)");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Multi-step form (integrated)</h1>
      <Stepper step={step} total={totalSteps} />
      <StepContainer>
        {step === FormStep.Personal && (
          <StepPersonal
            defaultValues={data as any}
            onNext={handleNextFromPersonal}
            onSave={(p) => setData(p)}
          />
        )}

        {step === FormStep.Contact && (
          <StepContact
            defaultValues={data as any}
            onBack={() => back()}
            onNext={() => next()}
            onSave={(p) => setData(p)}
          />
        )}

        {step === FormStep.Files && (
          <StepFiles
            defaultValues={{ attachments: (data as any).attachments }}
            onBack={() => back()}
            onNext={() => next()}
            onSave={(p) => setData(p)}
          />
        )}

        {step === FormStep.Review && (
          <StepReview
            data={data}
            onBack={() => back()}
            onSubmit={(p) => handleSubmit(p)}
          />
        )}
      </StepContainer>
    </main>
  );
}
