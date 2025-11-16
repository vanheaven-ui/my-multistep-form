import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useMultiStepForm } from "../../../features/hooks/multi-step-form/useMultiStepForm";
import { FormStep } from "../../../features/hooks/multi-step-form/types";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("useMultiStepForm autosave", () => {
  it("persists to localStorage and reloads state", async () => {
    const { result } = renderHook(() => useMultiStepForm({}));

    act(() => result.current.setData({ fullName: "Ezekiel" }));
    act(() => result.current.next());

    // wait for debounce to finish
    await new Promise((r) => setTimeout(r, 500));

    const raw = localStorage.getItem(result.current.storageKey);
    expect(raw).toBeTruthy();

    const { result: r2 } = renderHook(() => useMultiStepForm({}));
    expect(r2.current.step).toBeGreaterThanOrEqual(FormStep.Contact);
    expect((r2.current.data as any).fullName).toBe("Ezekiel");

    localStorage.clear();
  });
});
