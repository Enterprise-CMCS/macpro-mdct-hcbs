import { render } from "@testing-library/react";
import { PostLogoutRedirect } from ".";
import config from "config";

describe("PostLogoutRedirect", () => {
  it("should redirect to POST_SIGNOUT_REDIRECT", () => {
    // Mock config POST_SIGNOUT_REDIRECT
    (config as any).POST_SIGNOUT_REDIRECT = "https://example.com/logout";

    // Store the original window.location.href
    const originalHref = window.location.href;

    // Mock window.location.href
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    // Render the component
    render(<PostLogoutRedirect />);

    // Expect window.location.href to be set to the redirect URL
    expect(window.location.href).toBe("https://example.com/logout");

    // Restore original window.location.href
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: originalHref },
    });
  });
});
