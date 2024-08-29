import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { Menu } from "components";
import { testA11y } from "utils/testing/commonTests";

const menuComponent = (
  <RouterWrappedComponent>
    <Menu handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  test("Menu button is visible", () => {
    render(menuComponent);
    expect(screen.getByRole("button", { name: "my account" })).toBeVisible();
  });

  test("Manage Account is a menu item available", () => {
    render(menuComponent);
    expect(screen.getByAltText("Manage account")).toBeInTheDocument();
  });

  test("Log Out is a menu item available", () => {
    render(menuComponent);
    expect(screen.getByAltText("Logout")).toBeInTheDocument();
  });

  testA11y(menuComponent);
});
