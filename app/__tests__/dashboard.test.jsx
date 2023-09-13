import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import "@testing-library/jest-dom";
import Page from "../(user)/dashboard/page";

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

describe("Dashboard Page", () => {
  it("should render p tag", () => {
    const textElement = screen.getByText(/Bunker Planner/i);
    expect(textElement).toBeInTheDocument();
  });
});
