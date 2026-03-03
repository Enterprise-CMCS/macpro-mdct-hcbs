import { render, screen } from "@testing-library/react";
import { Alert } from "components";
import { AlertTypes } from "types";
import { testA11y } from "utils/testing/commonTests";

// jest.mock("react", () => ({
//   ...jest.requireActual("react"),
//   useRef: jest.fn().mockReturnValue({
//     current: {
//       scrollIntoView: jest.fn(),
//       focus: jest.fn(),
//     },
//   }),
// }));
// const mockRef = useRef(null).current as any;

/** The path to our alert SVG, as injected by jest */
const alertIcon = "test-file-stub";

const alertComponent = (
  <Alert title="Test alert!" link="https://example.com">
    This is for testing.
  </Alert>
);

describe("<Alert />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("should focus error alerts", () => {
    const scrollSpy = jest.spyOn(Element.prototype, "scrollIntoView");
    const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");

    const { rerender } = render(<Alert status={AlertTypes.INFO} title="" />);
    expect(scrollSpy).not.toHaveBeenCalled();
    expect(focusSpy).not.toHaveBeenCalled();

    rerender(<Alert status={AlertTypes.ERROR} title="" />);
    expect(scrollSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
  });

  testA11y(alertComponent);
});
