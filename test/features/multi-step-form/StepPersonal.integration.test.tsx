import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import StepPersonal from "../../../components/form/StepPersonal";

it("validates and calls onNext with valid data", async () => {
  const onNext = vi.fn();
  const onSave = vi.fn();

  render(<StepPersonal onNext={onNext} onSave={onSave} />);

  // click next without filling — should show validation
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
  });

  expect(
    await screen.findByText(/must be at least 2 characters/i),
  ).toBeTruthy();
  expect(await screen.findByText(/invalid email address/i)).toBeTruthy();

  // fill valid data
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Ezekiel Mworekwa" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "e@example.com" },
    });
  });

  // submit valid form
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
  });

  // expect handlers to be called
  expect(onSave).toHaveBeenCalled();
  expect(onNext).toHaveBeenCalled();
});
