"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalSchema } from "../../features/multi-step-form/schemas/formSchemas";
import type { z } from "zod";
import type { FormSchemaType } from "../../features/multi-step-form/schemas/formSchemas";

type PersonalData = z.infer<typeof PersonalSchema>;

export default function StepPersonal({
  defaultValues,
  onNext,
  onSave,
}: {
  defaultValues?: Partial<PersonalData>;
  onNext: (data: PersonalData) => void;
  onSave: (patch: Partial<FormSchemaType>) => void;
}) {
  const { register, handleSubmit, formState } = useForm<PersonalData>({
    resolver: zodResolver(PersonalSchema),
    defaultValues: defaultValues as any,
  });

  const submit = (values: PersonalData) => {
    onSave(values);
    onNext(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="block text-sm">Full name</label>
        <input
          {...register("fullName")}
          aria-label="Full name"
          className="mt-1 w-full border rounded p-2"
        />
        {formState.errors.fullName && (
          <p className="text-sm text-red-600">
            {String(formState.errors.fullName.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          {...register("email")}
          aria-label="Email"
          className="mt-1 w-full border rounded p-2"
        />
        {formState.errors.email && (
          <p className="text-sm text-red-600">
            {String(formState.errors.email.message)}
          </p>
        )}
      </div>

      <div className="flex gap-2">
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
