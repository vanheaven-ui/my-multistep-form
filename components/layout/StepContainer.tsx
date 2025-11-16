"use client";

import React from "react";
import { cn } from "../../lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function StepContainer({
  children,
  className,
}: StepContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto rounded-2xl shadow-md bg-white p-6 md:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
