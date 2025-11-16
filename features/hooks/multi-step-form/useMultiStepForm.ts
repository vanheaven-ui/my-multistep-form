"use client";

import { useReducer, useCallback, useEffect } from "react";
import { FormStep } from "./types";

type State = {
  step: FormStep;
  data: Record<string, unknown>;
};

type Action =
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "GOTO"; step: FormStep }
  | { type: "SET_DATA"; patch: Record<string, unknown> }
  | { type: "SET_STATE"; state: State };

const totalSteps = Object.keys(FormStep).filter((k) => isNaN(Number(k))).length;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: Math.min(state.step + 1, FormStep.Review) };
    case "BACK":
      return { ...state, step: Math.max(state.step - 1, FormStep.Personal) };
    case "GOTO":
      return { ...state, step: action.step };
    case "SET_DATA":
      return { ...state, data: { ...state.data, ...action.patch } };
    case "SET_STATE":
      return action.state;
    default:
      return state;
  }
}

function saveToStorage(key: string, state: State) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.warn("Failed to save multi-step form to localStorage", err);
  }
}

function loadFromStorage(key: string): State | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as State;
  } catch (err) {
    console.warn("Failed to load multi-step form from localStorage", err);
    return null;
  }
}

export function useMultiStepForm(
  initialData: Record<string, unknown> = {},
  key = "multiStepForm",
) {
  const storageKey = key;

  const [state, dispatch] = useReducer(reducer, {
    step: FormStep.Personal,
    data: initialData,
  });

  // Load saved state on mount
  useEffect(() => {
    const saved = loadFromStorage(storageKey);
    if (saved) {
      dispatch({ type: "SET_STATE", state: saved });
    }
  }, [storageKey]);

  // Autosave whenever state changes (debounced)
  useEffect(() => {
    const handle = setTimeout(() => saveToStorage(storageKey, state), 300);
    return () => clearTimeout(handle);
  }, [state, storageKey]);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const back = useCallback(() => dispatch({ type: "BACK" }), []);
  const goTo = useCallback(
    (step: FormStep) => dispatch({ type: "GOTO", step }),
    [],
  );
  const setData = useCallback(
    (patch: Record<string, unknown>) => dispatch({ type: "SET_DATA", patch }),
    [],
  );

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
