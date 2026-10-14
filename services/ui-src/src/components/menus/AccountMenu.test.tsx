import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterWrappedComponent } from "utils/testing/setupTests";
import { AccountMenu } from "components";
import { testA11y } from "utils/testing/commonTests";

const menuComponent = (
  <RouterWrappedComponent>
    <AccountMenu handleLogout={() => {}} />
  </RouterWrappedComponent>
);

describe("<Menu />", () => {
  it("should render correctly", () => {
    render(menuComponent);
    expect(screen.getByRole("button", { name: "my account" })).toBeVisible();
    expect(screen.getByAltText("Manage account")).toBeInTheDocument();
    expect(screen.getByAltText("Logout")).toBeInTheDocument();
  });

  testA11y(menuComponent);
});
