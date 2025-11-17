'use client';
import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { FormStep } from './types';

type State<T> = {
  step: FormStep;
  data: T;
};

type Action<T> =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'GOTO'; step: FormStep }
  | { type: 'SET_DATA'; patch: Partial<T> };

const totalSteps = Object.keys(FormStep).length / 2; // numeric keys only

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
    default:
      return state;
  }
}

export function useMultiStepForm<T extends Record<string, any>>(
  initialData: T,
) {
  const storageKey = 'multiStepFormState';

  // Load initial state from localStorage if it exists
  const initialState: State<T> = useMemo(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as State<T>;
    }
    return { step: FormStep.Personal, data: initialData };
  }, [initialData]);

  const [state, dispatch] = useReducer(reducer<T>, initialState);

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

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  return {
    step: state.step,
    totalSteps,
    next,
    back,
    goTo,
    data: state.data,
    setData,
    storageKey,
  };
}
