'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { FormStep } from './types';

type State<T> = {
  step: FormStep;
  data: T;
};

type Action<T> =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GOTO'; step: FormStep }
  | { type: 'SET_DATA'; patch: Partial<T> }
  | { type: 'RESET'; initialData: T };

const totalSteps = Object.keys(FormStep).length / 2;

// Reducer
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'NEXT':
      return { ...state, step: Math.min(state.step + 1, FormStep.Review) };
    case 'BACK':
      return { ...state, step: Math.max(state.step - 1, FormStep.Personal) };
    case 'GOTO':
      return { ...state, step: action.step };
    case 'SET_DATA':
      return { ...state, data: { ...state.data, ...action.patch } };
    case 'RESET':
      return { step: FormStep.Personal, data: action.initialData };
    default:
      return state;
  }
}

// ⬇️ Initialize from localStorage
function initState<T>(initialData: T): State<T> {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('multiStepFormState');
    if (raw) {
      try {
        return JSON.parse(raw) as State<T>;
      } catch {
        // ignore parse errors
      }
    }
  }
  return { step: FormStep.Personal, data: initialData };
}

export function useMultiStepForm<T extends object>(initialData: T) {
  const [state, dispatch] = useReducer(reducer<T>, initialData, initState);

  const next = useCallback(() => dispatch({ type: 'NEXT' }), []);
  const back = useCallback(() => dispatch({ type: 'BACK' }), []);
  const goTo = useCallback(
    (step: FormStep) => dispatch({ type: 'GOTO', step }),
    [],
  );
  const setData = useCallback(
    (patch: Partial<T>) => dispatch({ type: 'SET_DATA', patch }),
    [],
  );
  const reset = useCallback(() => {
    dispatch({ type: 'RESET', initialData });
    localStorage.removeItem('multiStepFormState');
  }, [initialData]);

  useEffect(() => {
    localStorage.setItem('multiStepFormState', JSON.stringify(state));
  }, [state]);

  return {
    step: state.step,
    totalSteps,
    next,
    back,
    goTo,
    data: state.data,
    setData,
    reset, 
    storageKey: 'multiStepFormState',
  };
}
