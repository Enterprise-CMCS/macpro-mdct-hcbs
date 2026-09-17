import React from "react";
import DOMPurify from "dompurify";
import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";

const externalLinkAltText = "(Opens in a new tab)";

const isExternalHref = (href?: string) => /^(https?:)?\/\//i.test(href ?? "");

const externalLinkIcon = () =>
  React.createElement(
    "svg",
    {
      "aria-label": externalLinkAltText,
      className: "parsed-html-link__external-icon",
      focusable: "false",
      role: "img",
      viewBox: "0 0 18 18",
    },
    React.createElement("path", {
      d: "M12.75 1.5h3.75v3.75H15V4.06l-6.22 6.22-1.06-1.06 6.22-6.22h-1.19V1.5Z",
      fill: "currentColor",
    }),
    React.createElement("path", {
      d: "M14.25 9v6a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 15V5.25A1.5 1.5 0 0 1 3 3.75h6v1.5H3V15h9.75V9h1.5Z",
      fill: "currentColor",
    })
  );

const parserOptions: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element) || domNode.name !== "a") {
      return;
    }

    const opensInNewTab =
      domNode.attribs.target === "_blank" ||
      isExternalHref(domNode.attribs.href);
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

    return React.createElement(
      "a",
      attributesToProps(anchorAttributes),
      domToReact(domNode.children as DOMNode[], parserOptions),
      opensInNewTab && externalLinkIcon()
    );
  },
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
  const parsedHtml = parse(sanitizedHtml, parserOptions);
  return parsedHtml;
};
