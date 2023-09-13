import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import "@testing-library/jest-dom";
import Page from "../(user)/login/page";

const routerPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: routerPush,
    query: {},
  }),
}));

const mockSession = {
  user: {
    email: "test@example.com",
    password: "test@123",
  },
};

beforeEach(() => {
  render(
    <SessionProvider session={mockSession}>
      <Page />
    </SessionProvider>
  );
});

describe("Login Page", () => {
  it("Email input should render", () => {
    const emailInputEle = screen.getByPlaceholderText("Email");
    expect(emailInputEle).toBeInTheDocument();
  });

  it("Password input should render", () => {
    const passwordInputEle = screen.getByPlaceholderText("Password");
    expect(passwordInputEle).toBeInTheDocument();
  });

  it("Login button should be rendered", () => {
    const buttonEl = screen.getByTestId("login");
    expect(buttonEl).toBeInTheDocument();
  });

  it("Login with google button should be rendered", () => {
    const buttonEl = screen.getByTestId("loginWithgoogle");
    expect(buttonEl).toBeInTheDocument();
  });

  it("Email input value should be changed", () => {
    const emailInputEl = screen.getByPlaceholderText("Email");
    const testValue = "abc@gmail.com";
    fireEvent.change(emailInputEl, { target: { value: testValue } });
    expect(emailInputEl.value).toBe(testValue);
  });

  it("Password input value should be changed", () => {
    const passwordInputEl = screen.getByPlaceholderText("Password");
    const testValue = "abc@123";
    fireEvent.change(passwordInputEl, { target: { value: testValue } });
    expect(passwordInputEl.value).toBe(testValue);
  });

  it("Should display error message when invalid credentials are entered", async () => {
    // Mock signIn function to return an error
    const signInMock = jest.spyOn(require("next-auth/react"), "signIn");
    signInMock.mockResolvedValue({ error: "Invalid credentials" });

    // Click the login button
    const buttonEl = screen.getByTestId("login");
    fireEvent.click(buttonEl);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText("Invalid Credential");
    expect(errorMessage).toBeInTheDocument();

    // Restore the original signIn function to avoid affecting other test cases.
    signInMock.mockRestore();
  });

  // it("Should redirect to '/dashboard' after successful login", async () => {
  //   // Mock signIn function to return a success response
  //   const signInMock = jest.spyOn(require("next-auth/react"), "signIn");
  //   signInMock.mockResolvedValue({});

  //   const buttonEl = screen.getByTestId("login");
  //   fireEvent.click(buttonEl);

  //   // Wait for the router to be called with the correct path
  //   await waitFor(() => {
  //     expect(routerPush).toHaveBeenCalledWith("/dashboard");
  //   });

  //   // Restore the original signIn function to avoid affecting other test cases.
  //   signInMock.mockRestore();
  // });
});
