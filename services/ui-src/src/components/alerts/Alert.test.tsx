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
  test("Alert is visible", () => {
    render(alertComponent);
    expect(screen.getByRole("alert")).toBeVisible();
  });
  test("Alert link is visible", () => {
    render(alertComponent);
    expect(
      screen.getByRole("link", { name: "https://example.com" })
    ).toHaveAttribute("href", "https://example.com");
  });
  test("Alert text exists", () => {
    render(alertComponent);
    expect(screen.getByRole("alert")).toHaveTextContent("This is for testing.");
  });

  test("Alert image exists", () => {
    render(alertComponent);
    expect(screen.getByRole("img", { name: "Alert" })).toBeVisible();
  });

  testA11y(alertComponent);
});
