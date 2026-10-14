import React from "react";
import { ExternalLinkIcon } from "@cmsgov/design-system";
import DOMPurify from "dompurify";
import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
} from "html-react-parser";

export const externalLinkAltText = "(Opens in a new tab)";

/** Ensure links have appropriate `target`, `rel`, and external link icon. */
const linkReplacer = (domNode: DOMNode) => {
  if (!(domNode instanceof Element) || domNode.name !== "a") {
    return;
  }

  const isExternalHref = /^(https?:)?\/\//i.test(domNode.attribs.href ?? "");
  const opensInNewTab = domNode.attribs.target === "_blank" || isExternalHref;
  const className = ["parsed-html-link", domNode.attribs.class]
    .filter(Boolean)
    .join(" ");
  const anchorAttributes = {
    ...domNode.attribs,
    class: className,
    ...(opensInNewTab && {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  };
  const externalLinkIcon = React.createElement(ExternalLinkIcon, {
    ariaHidden: false,
    className: "external-link-icon",
    title: externalLinkAltText,
  });

  return React.createElement(
    "a",
    attributesToProps(anchorAttributes),
    domToReact(domNode.children as DOMNode[], { replace: linkReplacer }),
    opensInNewTab && externalLinkIcon
  );
};

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
  const parsedHtml = parse(sanitizedHtml, { replace: linkReplacer });
  return parsedHtml;
};
