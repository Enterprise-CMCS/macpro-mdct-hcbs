import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { LoginIDM } from "components";
import { testA11y } from "utils/testing/commonTests";

const loginIDMComponent = (
  <RouterWrappedComponent>
    <LoginIDM />
  </RouterWrappedComponent>
);

describe("<LoginIDM />", () => {
  it("should render", () => {
    render(loginIDMComponent);
    const loginButton = screen.getByRole("button");
    expect(loginButton).toBeVisible();
  });

  testA11y(loginIDMComponent);
});
