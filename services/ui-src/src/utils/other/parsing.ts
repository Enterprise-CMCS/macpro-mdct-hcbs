import React from "react";
import { ExternalLinkIcon } from "@cmsgov/design-system";
import DOMPurify from "dompurify";
import parse, {
  attributesToProps,
  DOMNode,
  domToReact,
  Element,
  HTMLReactParserOptions,
} from "html-react-parser";

export const externalLinkAltText = "(Opens in a new tab)";

const isExternalHref = (href?: string) => /^(https?:)?\/\//i.test(href ?? "");

const isLegacyExternalLinkIcon = (domNode: DOMNode) =>
  domNode instanceof Element &&
  domNode.name === "img" &&
  domNode.attribs.src === "/icon_external_link_main.svg";

const externalLinkIcon = () =>
  React.createElement(ExternalLinkIcon, {
    ariaHidden: false,
    className: "external-link-icon",
    title: externalLinkAltText,
  });

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
      domToReact(
        domNode.children.filter(
          (child) => !opensInNewTab || !isLegacyExternalLinkIcon(child)
        ) as DOMNode[],
        parserOptions
      ),
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
