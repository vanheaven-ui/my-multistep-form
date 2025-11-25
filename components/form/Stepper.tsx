'use client';

import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';

interface StepperProps {
  step: number; // Current step index (0-based)
  total: number; 
  onStepClick?: (index: number) => void; 
  stepTitles?: string[]; 
}

export default function Stepper({ step, total, onStepClick, stepTitles }: StepperProps) {
  // Calculate percentage for the progress bar
  const progressPercentage = ((step + 1) / total) * 100;

  // Create an array to map over for individual step indicators
  const stepIndicators = Array.from({ length: total }, (_, index) => {
    const isCompleted = index < step;
    const isActive = index === step;
    const isClickable = onStepClick && index <= step;

    let buttonClass = 'transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold';
    let lineClass = 'flex-1 h-0.5 transition-all duration-300';
    
    // Styling the step indicator circle
    if (isCompleted) {
      buttonClass += ' bg-emerald-500 text-white'; // Completed steps are fully emerald
      lineClass += ' bg-emerald-500'; 
    } else if (isActive) {
      buttonClass += ' bg-white border-2 border-emerald-500 text-emerald-600 shadow-md'; // Active step is highlighted
      lineClass += ' bg-gray-300';
    } else {
      buttonClass += ' bg-gray-100 border border-gray-300 text-gray-500'; // Pending steps are gray
      lineClass += ' bg-gray-300';
    }

    if (isClickable) {
        buttonClass += ' cursor-pointer hover:scale-105';
    }

    return (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={buttonClass}
                title={stepTitles ? stepTitles[index] : `Step ${index + 1}`}
            >
                {isCompleted ? <FiCheckCircle className="w-5 h-5" /> : index + 1}
            </button>
            
            {/* Step Title (Optional) */}
            {stepTitles && (
                <span className={`mt-2 text-xs text-center whitespace-nowrap max-w-[80px]
                    ${isActive ? 'font-bold text-emerald-600' : 'text-gray-500'}`}
                >
                    {stepTitles[index]}
                </span>
            )}
        </div>
        {/* Separator line for all steps except the last one */}
        {index < total - 1 && (
            <div className={lineClass} />
        )}
      </React.Fragment>
    );
  });

  return (
    <div className="p-4 mb-8 bg-white rounded-xl shadow-lg border border-gray-100">
        
        {/* 1. Progress Bar (Modernized) */}
        <div className="mb-4">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                <span>Progress</span>
                <span className="text-emerald-600">Step {step + 1} of {total}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    style={{ width: `${progressPercentage}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-inner shadow-emerald-700/50"
                />
            </div>
        </div>
        
        {/* 2. Step Indicators (Unique) */}
        <div className="flex justify-between items-start pt-4">
            {stepIndicators}
        </div>
    </div>
  );
}