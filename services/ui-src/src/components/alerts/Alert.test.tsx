import { render, screen } from "@testing-library/react";
import { Alert } from "components";
import { testA11y } from "utils/testing/commonTests";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    link="https://example.com"
  />
);

describe("<Alert />", () => {
  beforeEach(() => {
    render(alertComponent);
  });
  test("Alert is visible", () => {
    expect(screen.getByRole("alert")).toBeVisible();
  });
  test("Alert link is visible", () => {
    expect(
      screen.getByRole("link", { name: "https://example.com" })
    ).toHaveAttribute("href", "https://example.com");
  });
  test("Alert text exists", () => {
    expect(screen.getByRole("alert")).toHaveTextContent("This is for testing.");
  });

  test("Alert image exists", () => {
    expect(screen.getByRole("img", { name: "Alert" })).toBeVisible();
  });

  testA11y(alertComponent);
});
