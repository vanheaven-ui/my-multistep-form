import { render, screen, fireEvent } from "@testing-library/react";
import StepPersonal from "../StepPersonal";

test("renders form and validates inputs", async () => {
  const onNext = vi.fn();
  render(<StepPersonal onNext={onNext} />);
  const name = screen.getByLabelText(/Full name/i);
  const email = screen.getByLabelText(/Email/i);
  const btn = screen.getByRole("button", { name: /next/i });

  // invalid submit
  fireEvent.click(btn);
  expect(await screen.findByText(/Required|must/i)).toBeTruthy();

  // valid submit
  fireEvent.change(name, { target: { value: "Ezekiel Mworekwa" } });
  fireEvent.change(email, { target: { value: "e@example.com" } });
  fireEvent.click(btn);
  expect(onNext).toHaveBeenCalled();
});
