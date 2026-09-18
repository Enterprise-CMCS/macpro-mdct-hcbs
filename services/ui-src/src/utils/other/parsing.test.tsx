import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
import { parseHtml } from "utils";

vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn((el) => el),
    addHook: vi.fn(),
  },
}));

describe("utils/parsing", () => {
  describe("parseCustomHtml", () => {
    it("should sanitize the input and return renderable React elements", () => {
      const htmlString = "<span><em>test text</em></span>";

      const elements = parseHtml(htmlString);
      render(elements);

      expect(DOMPurify.sanitize).toHaveBeenCalled();
      expect(screen.getByText("test text")).toBeInTheDocument();
    });

    it("should secure links that open in a new tab", () => {
      const hook = vi.mocked(DOMPurify.addHook).mock.calls[0][1] as (node: {
        tagName: string;
        getAttribute: (name: string) => string | null;
        setAttribute: (name: string, value: string) => void;
      }) => void;
      const setAttribute = vi.fn();

      hook({
        tagName: "A",
        getAttribute: (name) => (name === "target" ? "_blank" : null),
        setAttribute,
      });

      expect(setAttribute).toHaveBeenCalledWith("rel", "noopener noreferrer");
    });
    it("should render parsed external links with the requested class, target, rel, and icon", () => {
      const htmlString = '<a href="https://example.com">external link</a>';

      const elements = parseHtml(htmlString);
      render(elements);

      const link = screen.getByRole("link", {
        name: /external link \(Opens in a new tab\)/,
      });
      const icon = screen.getByRole("img", {
        name: "(Opens in a new tab)",
      });

      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveClass("parsed-html-link");
      expect(icon).toHaveClass("parsed-html-link__external-icon");
    });
  });
});
