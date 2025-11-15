import React from "react";
import { useForm } from "react-hook-form";

interface StepPersonalProps {
  onNext: (data: { name: string; email: string }) => void;
}

export default function StepPersonal({ onNext }: StepPersonalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* FULL NAME */}
      <div className="flex flex-col">
        <label htmlFor="name" className="font-medium">
          Full name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Required" })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="border p-2 rounded"
        />
        {errors.name && (
          <p id="name-error" className="text-red-500 text-sm">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className="flex flex-col">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Email must be valid",
            },
          })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="border p-2 rounded"
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* NEXT BUTTON */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </form>
  );
}
