import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PostLogoutRedirect } from ".";
import config from "config";

describe("PostLogoutRedirect", () => {
  it("should redirect to POST_SIGNOUT_REDIRECT", () => {
    config.POST_SIGNOUT_REDIRECT = "https://example.com/logout";
    const originalHref = window.location.href;

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "" },
    });

    render(<PostLogoutRedirect />);

    expect(window.location.href).toBe("https://example.com/logout");

    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: originalHref },
    });
  });
});
