import { render, screen } from "@testing-library/react";
import { Alert } from "components";
import { testA11y } from "utils/testing/commonTests";

/** The path to our alert SVG, as injected by jest */
const alertIcon = "test-file-stub";

const alertComponent = (
  <Alert title="Test alert!" link="https://example.com">
    This is for testing.
  </Alert>
);

describe("<Alert />", () => {
  it("should render correctly", () => {
    render(alertComponent);
    expect(screen.getByRole("alert")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "https://example.com" })
    ).toHaveAttribute("href", "https://example.com");
    expect(screen.getByRole("alert")).toHaveTextContent("This is for testing.");
    expect(screen.getByRole("img", { name: "Alert" })).toBeVisible();
    expect(screen.getByAltText("Alert")).toHaveAttribute("src", alertIcon);
  });

  it("should hide the icon when appropriate", () => {
    render(<Alert title="mock title" showIcon={false} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  testA11y(alertComponent);
});
