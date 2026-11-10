import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  mockCMSReviewerUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { Header } from "components";
import { testA11y } from "utils/testing/commonTests";

const mockLogout = vi.fn();

const headerComponent = (
  <RouterWrappedComponent>
    <Header handleLogout={mockLogout} />
  </RouterWrappedComponent>
);

describe("<Header />", () => {
  it("should render Logo, Help and Menu", () => {
    render(headerComponent);
    const header = screen.getAllByRole("banner");
    expect(header[0]).toBeVisible();
    // find img elements
    expect(screen.getByRole("img", { name: "HCBS logo" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Help" })).toBeVisible();
    expect(screen.getByRole("img", { name: "Account" })).toBeVisible();
    expect(screen.getByAltText("Arrow down")).toBeVisible();
  });

  it("should hide the Admin menu from CMS reviewers", () => {
    useStore.setState({ user: mockCMSReviewerUser });

    render(headerComponent);

    expect(
      screen.queryByRole("button", { name: "admin menu" })
    ).not.toBeInTheDocument();
  });

  it("should expand the My Account menu", async () => {
    render(headerComponent);

    const menuButton = screen.getByRole("button", {
      name: "my account",
      expanded: false,
    });
    expect(menuButton).toBeInTheDocument();

    await userEvent.click(menuButton);

    expect(
      screen.getByRole("button", { name: "my account", expanded: true })
    ).toBeInTheDocument();
  });

  it("should log out the user", async () => {
    render(headerComponent);

    const menuButton = screen.getByRole("button", { name: "my account" });
    await userEvent.click(menuButton);

    const logoutButton = screen.getByRole("img", { name: "Logout" });
    expect(logoutButton).toBeInTheDocument();
    await userEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  testA11y(headerComponent);
});
