"use client";

import React from "react";

interface StepperProps {
  step: number;
  total: number;
}

export default function Stepper({ step, total }: StepperProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-sm font-medium">
        Step {step + 1} of {total}
      </div>
      <div className="flex-1 h-2 bg-slate-100 rounded overflow-hidden">
        <div
          style={{ width: `${((step + 1) / total) * 100}%` }}
          className="h-full bg-blue-600 transition-all duration-300"
        />
      </div>
    </div>
  );
}
