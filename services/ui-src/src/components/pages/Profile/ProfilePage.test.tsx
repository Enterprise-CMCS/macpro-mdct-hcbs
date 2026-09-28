import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfilePage } from "components";
import {
  mockAdminUser,
  mockStateUser,
  RouterWrappedComponent,
} from "utils/testing/setupTests";
import { useStore } from "utils";
import { testA11yAct } from "utils/testing/commonTests";

const ProfilePageComponent = (
  <RouterWrappedComponent>
    <ProfilePage />
  </RouterWrappedComponent>
);

describe("Profile Page", () => {
  it("should render correctly for admin users", () => {
    useStore.setState({ user: mockAdminUser });

    render(ProfilePageComponent);

    expect(
      screen.getByRole("row", { name: "Email adminuser@test.com" })
    ).toBeVisible();
    expect(screen.queryByText("stateuser@test.com")).not.toBeInTheDocument();
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("N/A")).toBeVisible();
  });

  it("should render correctly for state users", () => {
    useStore.setState({ user: mockStateUser });

    render(ProfilePageComponent);

    expect(
      screen.getByRole("row", { name: "Email stateuser@test.com" })
    ).toBeVisible();
    expect(screen.queryByText("adminuser@test.com")).not.toBeInTheDocument();
    expect(screen.getByText("State")).toBeVisible();
    expect(screen.getByText("MN")).toBeVisible();
    expect(screen.queryByText("Banner Editor")).not.toBeInTheDocument();
  });

  describe("Accessibility for admins", () => {
    useStore.setState({ user: mockAdminUser });
    testA11yAct(ProfilePageComponent);
  });

  describe("Accessibility for state users", () => {
    useStore.setState({ user: mockStateUser });
    testA11yAct(ProfilePageComponent);
  });
});
