import { render, screen } from "@testing-library/react";
import { Alert } from "components";
import { testA11y } from "utils/testing/commonTests";

/** The path to our alert SVG, as injected by jest */
const alertIcon = "test-file-stub";

const alertComponent = (
  <Alert
    title="Test alert!"
    description="This is for testing."
    link="https://example.com"
    icon={alertIcon}
    showIcon={true}
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
  test("renders fallback alertIcon when icon prop is not provided", () => {
    expect(screen.getByAltText("Alert")).toHaveAttribute("src", alertIcon);
  });

  testA11y(alertComponent);
});

describe("Test Alert icon if custom or if showIcon is false", () => {
  test("renders custom icon when icon prop is provided", () => {
    render(<Alert icon="customIcon.png" />);

    expect(screen.getByAltText("Alert")).toHaveAttribute(
      "src",
      "customIcon.png"
    );
  });

  test("does not render the icon when showIcon is false", () => {
    render(<Alert showIcon={false} />);

    expect(screen.queryByAltText("Alert")).not.toBeInTheDocument();
  });
});
