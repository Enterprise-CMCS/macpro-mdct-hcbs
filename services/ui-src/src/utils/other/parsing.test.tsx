import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DOMPurify from "dompurify";
import { parseHtml } from "utils";

vi.mock("dompurify", () => ({
  default: {
    sanitize: vi.fn((el) => el),
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
  });
});
