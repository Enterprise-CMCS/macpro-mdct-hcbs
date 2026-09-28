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
  });
});
