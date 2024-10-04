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
  const title = "Test Alert";
  const description = "This is a test description";

  const sx = {
    icon: { width: "100px" },
    contentBox: {},
    descriptionText: {},
    linkText: {},
  };

  test("renders custom icon when icon prop is provided", () => {
    render(
      <Alert
        status={AlertTypes.INFO}
        title={title}
        description={description}
        icon={customIcon}
        showIcon={true}
        sx={sx}
      />
    );

    const imgElement = screen.getByAltText("Alert");
    expect(imgElement).toHaveAttribute("src", customIcon);
  });

  test("renders fallback alertIcon when icon prop is not provided", () => {
    render(
      <Alert
        status={AlertTypes.INFO}
        title={title}
        description={description}
        showIcon={true}
        sx={sx}
      />
    );

    const imgElement = screen.getByAltText("Alert");
    expect(imgElement).toHaveAttribute("src", alertIcon);
  });

  it("does not render the icon when showIcon is false", () => {
    render(
      <Alert
        status={AlertTypes.INFO}
        title={title}
        description={description}
        showIcon={false}
        sx={sx}
      />
    );

    const imgElement = screen.queryByAltText("Alert");
    expect(imgElement).not.toBeInTheDocument();
  });
});
