import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./page";

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

const user = userEvent.setup();

describe("Login", () => {
  it("renders a login card", () => {
    render(<Login />);
    expect(screen.getByTestId("login-card")).toBeInTheDocument();
  });
  it("contains a link to sign up", () => {
    render(<Login />);
    const link = screen.getByText("Sign up");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/signup");
  });
});

describe("Login Form", () => {
  it("contains a form", () => {
    render(<Login />);
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });
  it("contains an email field", () => {
    render(<Login />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
  it("contains a password field", () => {
    render(<Login />);
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
  it("contains a link to recover password", () => {
    render(<Login />);
    const link = screen.getByText("Forgot your password?");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/recover-password");
  });
  it("contains a submit button", () => {
    render(<Login />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
  it("displays a message if the email is invalid", async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "invalid-email");
    await user.tab();
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
  });
  it("displays a message if the password is empty", async () => {
    render(<Login />);
    const passwordInput = screen.getByLabelText("Password");
    await user.click(passwordInput);
    await user.tab();
    expect(screen.getByText("Please enter your password.")).toBeInTheDocument();
  });
});

describe("Submit button", () => {
  it("is initially disabled", () => {
    render(<Login />);
    const button = screen.getByRole("button", { name: "Login" });
    expect(button).toBeDisabled();
  });
  it("is disabled if a field is invalid", async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    await user.type(emailInput, "invalid-email");
    await user.type(passwordInput, "password");
    const button = screen.getByRole("button", { name: "Login" });
    expect(button).toBeDisabled();
  });
});
