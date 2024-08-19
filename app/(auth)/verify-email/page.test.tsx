import { render, screen } from "@testing-library/react";
import VerifyEmail from "./page";

describe("VerifyEmail", () => {
  it("renders a heading", () => {
    render(<VerifyEmail />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Email Confirmation" }),
    ).toBeInTheDocument();
  });
  it("renders a info text", () => {
    render(<VerifyEmail />);
    expect(
      screen.getByText(
        "Thanks for signing up. We have sent you an email to confirm the validity of your email address.",
      ),
    ).toBeInTheDocument();
  });
});
