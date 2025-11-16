"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ContactSchema } from "../../features/multi-step-form/schemas/formSchemas";
import type { z } from "zod";
import type { FormSchemaType } from "../../features/multi-step-form/schemas/formSchemas";

type ContactData = z.infer<typeof ContactSchema>;

export default function StepContact({
  defaultValues,
  onNext,
  onBack,
  onSave,
}: {
  defaultValues?: Partial<ContactData>;
  onNext: (data: ContactData) => void;
  onBack: () => void;
  onSave: (patch: Partial<FormSchemaType>) => void;
}) {
  const { register, handleSubmit } = useForm<ContactData>({
    defaultValues: defaultValues as any,
  });

  const submit = (values: ContactData) => {
    onSave(values);
    onNext(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm">Phone</label>
        <input
          {...register("phone")}
          aria-label="Phone"
          className="mt-1 w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-sm">Address</label>
        <input
          {...register("address")}
          aria-label="Address"
          className="mt-1 w-full border rounded p-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>
    </form>
  );
}
