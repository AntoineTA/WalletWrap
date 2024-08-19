import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UsernameField from "./UsernameField";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import MFAField from "./MFAField";

const mockUser = {
  user_metadata: {
    username: "testuser",
    hasMFA: false,
  },
  email: "test@test.com",
};

const user = userEvent.setup();

describe("Username Field", () => {
  it("should render", () => {
    render(<UsernameField username={mockUser.user_metadata.username} />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.user_metadata.username),
    ).toBeInTheDocument();
  });
  it("should render an edit button", () => {
    render(<UsernameField username={mockUser.user_metadata.username} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
  it("should render a form when the edit button is clicked", async () => {
    render(<UsernameField username={mockUser.user_metadata.username} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByTestId("username-field")).toBeInTheDocument();
  });
  it("should render a submit button when the edit button is cliked", async () => {
    render(<UsernameField username={mockUser.user_metadata.username} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });
  it("should render a cancel button when the edit button is clicked", async () => {
    render(<UsernameField username={mockUser.user_metadata.username} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});

describe("Email Field", () => {
  it("should render", () => {
    render(<EmailField email={mockUser.email} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });
  it("should render an edit button", () => {
    render(<EmailField email={mockUser.email} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
  it("should render a form when the edit button is clicked", async () => {
    render(<EmailField email={mockUser.email} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByTestId("email-field")).toBeInTheDocument();
  });
  it("should render a submit button when the edit button is clicked", async () => {
    render(<EmailField email={mockUser.email} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });
  it("should render a cancel button when the edit button is clicked", async () => {
    render(<EmailField email={mockUser.email} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});

describe("Password Field", () => {
  it("should render", () => {
    render(<PasswordField />);
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("********")).toBeInTheDocument();
  });
  it("should render an edit button", () => {
    render(<PasswordField />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
  it("should render a form when the edit button is clicked", async () => {
    render(<PasswordField />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByTestId("password-field")).toBeInTheDocument();
  });
  it("should render a submit button when the edit button is clicked", async () => {
    render(<PasswordField />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });
  it("should render a cancel button when the edit button is clicked", async () => {
    render(<PasswordField />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});

describe("MFA Field", () => {
  it("should render", () => {
    render(<MFAField hasMFA={mockUser.user_metadata.hasMFA} />);
    expect(screen.getByText("Two-Factor Authentication")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
  it("should render an edit button", () => {
    render(<MFAField hasMFA={mockUser.user_metadata.hasMFA} />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
  it("should render links when the edit button is clicked", async () => {
    render(<MFAField hasMFA={mockUser.user_metadata.hasMFA} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByRole("link", { name: "Add 2FA" })).toBeInTheDocument();
  });
  it("should render a cancel button when the edit button is clicked", async () => {
    render(<MFAField hasMFA={mockUser.user_metadata.hasMFA} />);
    const editButton = screen.getByText("Edit");
    await user.click(editButton);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });
});
