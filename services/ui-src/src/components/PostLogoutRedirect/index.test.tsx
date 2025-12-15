import { render } from "@testing-library/react";
import { PostLogoutRedirect } from ".";
import config from "config";

describe("PostLogoutRedirect", () => {
  test("should redirect to POST_SIGNOUT_REDIRECT", () => {
    config.POST_SIGNOUT_REDIRECT = "https://example.com/logout";

    // Mock window.location.href using Object.defineProperty
    let capturedHref = "";
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      window,
      "location"
    );

    delete (window as any).location;
    Object.defineProperty(window, "location", {
      value: {
        get href() {
          return capturedHref;
        },
        set href(value: string) {
          capturedHref = value;
        },
      },
      writable: true,
      configurable: true,
    });

    render(<PostLogoutRedirect />);

    expect(capturedHref).toBe("https://example.com/logout");

    // Restore original location
    if (originalDescriptor) {
      Object.defineProperty(window, "location", originalDescriptor);
    }
  });
});
