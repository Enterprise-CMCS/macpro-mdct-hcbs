import { render, screen } from "@testing-library/react";
import { Alert } from "components";
import { AlertTypes } from "types";
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

describe("Alert icon", () => {
  const alertIcon = "test-file-stub";
  const customIcon = "customIcon.png";

  test("renders custom icon when icon prop is provided", () => {
    render(
      <Alert status={AlertTypes.INFO} icon={customIcon} showIcon={true} />
    );

    const imgElement = screen.getByAltText("Alert");
    expect(imgElement).toHaveAttribute("src", customIcon);
  });

  test("renders fallback alertIcon when icon prop is not provided", () => {
    render(<Alert status={AlertTypes.INFO} showIcon={true} />);

    const imgElement = screen.getByAltText("Alert");
    expect(imgElement).toHaveAttribute("src", alertIcon);
  });

  test("does not render the icon when showIcon is false", () => {
    render(<Alert status={AlertTypes.INFO} showIcon={false} />);

    const imgElement = screen.queryByAltText("Alert");
    expect(imgElement).not.toBeInTheDocument();
  });
});
