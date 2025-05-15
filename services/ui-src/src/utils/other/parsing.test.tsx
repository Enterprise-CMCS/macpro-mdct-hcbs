import { render, screen } from "@testing-library/react";
import { sanitize } from "dompurify";
import { parseHtml } from "utils";

jest.mock("dompurify", () => ({
  sanitize: jest.fn((el) => el),
}));

describe("utils/parsing", () => {
  describe("parseCustomHtml", () => {
    test("should sanitize the input and return renderable React elements", () => {
      const htmlString = "<span><em>test text</em></span>";

      const elements = parseHtml(htmlString);
      render(<>{elements}</>);

      expect(sanitize).toHaveBeenCalled();
      expect(screen.getByText("test text")).toBeInTheDocument();
    });
  });
});
