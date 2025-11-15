import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import StepPersonal from "../StepPersonal";

describe("StepPersonal Component", () => {
  test("renders form and validates inputs individually", async () => {
    const onNext = vi.fn();
    render(<StepPersonal onNext={onNext} />);

    const nameInput = screen.getByLabelText(/Full name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const nextButton = screen.getByRole("button", { name: /next/i });

    const user = userEvent.setup();

    // -------- Invalid submit --------
    await user.click(nextButton);

    // Check for validation errors
    const errors = await screen.findAllByText(/Required|must/i);
    expect(errors.length).toBe(2);

    // -------- Valid submit --------
    await user.type(nameInput, "Ezekiel Mworekwa");
    await user.type(emailInput, "e@example.com");
    await user.click(nextButton);

    // onNext should be called once with correct data
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledWith({
      name: "Ezekiel Mworekwa",
      email: "e@example.com",
    });
  });
});
