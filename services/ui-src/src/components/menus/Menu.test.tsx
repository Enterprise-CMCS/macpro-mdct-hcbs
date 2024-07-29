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
    expect(screen.getByTestId("header-menu-dropdown-button")).toBeVisible();
  });

  testA11y(menuComponent);
});
