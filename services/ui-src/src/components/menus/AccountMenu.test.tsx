import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { AccountMenu } from "components";
import { testA11y } from "utils/testing/commonTests";

const menuComponent = (
  <RouterWrappedComponent>
    <AccountMenu handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  beforeEach(() => {
    render(menuComponent);
  });
  test("Menu button is visible", () => {
    expect(screen.getByRole("button", { name: "my account" })).toBeVisible();
  });

  test("Manage Account is a menu item available", () => {
    expect(screen.getByAltText("Manage account")).toBeInTheDocument();
  });

  test("Log Out is a menu item available", () => {
    expect(screen.getByAltText("Logout")).toBeInTheDocument();
  });

  testA11y(menuComponent);
});
