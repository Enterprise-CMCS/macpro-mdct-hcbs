import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupJest";
import { LoginIDM } from "components";
import { testA11y } from "utils/testing/commonTests";

const loginIDMComponent = (
  <RouterWrappedComponent>
    <LoginIDM />
  </RouterWrappedComponent>
);

describe("<LoginIDM />", () => {
  test("LoginIDM is visible", () => {
    render(loginIDMComponent);
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeVisible();
  });

  testA11y(loginIDMComponent);
});
