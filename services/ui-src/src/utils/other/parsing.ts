import DOMPurify from "dompurify";
import parse from "html-react-parser";

/** Parse HTML string, sanitize, and return React elements. */
export const parseHtml = (html: string) => {
  const sanitizedHtml = DOMPurify.sanitize(html);
  const parsedHtml = parse(sanitizedHtml);
  return parsedHtml;
};
