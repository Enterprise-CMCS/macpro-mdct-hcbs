import DOMPurify from "dompurify";
import parse from "html-react-parser";

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

/** Parse HTML string, sanitize, and return React elements. */
export const parseHtml = (html: string) => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ["href", "alt", "target", "rel", "class", "src"],
  });
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};
