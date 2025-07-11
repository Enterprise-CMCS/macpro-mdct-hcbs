import { Accordion, Divider } from "@chakra-ui/react";
import { TextField } from "components/fields/TextField";
import { TextAreaField } from "components/fields/TextAreaField";
import { AccordionItem } from "components";
import {
  HeaderElement,
  NestedHeadingElement,
  ParagraphElement,
  SubHeaderElement,
} from "components/report/Elements";
import { ElementType, HeaderIcon } from "types";

export const elementArray = [
  {
    name: "Header",
    description: "Big text at the top of the page",
    variants: [
      <HeaderElement
        formkey="5412"
        element={{
          type: ElementType.Header,
          id: "id-header",
          text: "HeaderElement",
        }}
      />,
      <HeaderElement
        formkey="5413"
        element={{
          type: ElementType.Header,
          id: "id-header-with-icon",
          text: "HeaderElement with Icon",
          icon: HeaderIcon.Check,
        }}
      />,
    ],
  },
  {
    name: "SubHeader",
    description: "This is a subheader",
    variants: [
      <SubHeaderElement
        formkey="5414"
        element={{
          type: ElementType.SubHeader,
          id: "id-subheader",
          text: "SubHeaderElement",
        }}
      />,
    ],
  },
  {
    name: "Nested Heading",
    description: "This is a nested heading",
    variants: [
      <NestedHeadingElement
        formkey="5415"
        element={{
          type: ElementType.NestedHeading,
          id: "id-nestedheading",
          text: "NestedHeadingElement",
        }}
      />,
    ],
  },
  {
    name: "Text Field",
    description: "A field for entering text",
    variants: [
      <TextField
        formkey="5416"
        element={{
          type: ElementType.Textbox,
          id: "id-textfield",
          label: "TextField",
        }}
      />,
    ],
  },
  {
    name: "Text Area Field",
    description: "A field for entering text",
    variants: [
      <TextAreaField
        formkey="5417"
        element={{
          type: ElementType.TextAreaField,
          id: "id-textareafield",
          label: "TextAreaField",
        }}
      />,
    ],
  },
  {
    name: "Paragraph",
    description: "A paragraph of text",
    variants: [
      <ParagraphElement
        formkey="5418"
        element={{
          type: ElementType.Paragraph,
          id: "id-paragraph",
          text: "ParagraphElement",
        }}
      />,
    ],
  },
  {
    name: "Divider",
    description: "A horizontal line to separate content",
    variants: [<Divider />],
  },
  {
    name: "Accordion",
    description: "A collapsible section for content",
    variants: [
      <Accordion allowToggle={true}>
        <AccordionItem label="Accordion Item 1">
          I am the content of the first accordion item.
        </AccordionItem>
        <AccordionItem label="Accordion Item 2">
          I am the content of the second accordion item.
        </AccordionItem>
        <AccordionItem label="Accordion Item 3">
          I am the content of the third accordion item.
        </AccordionItem>
      </Accordion>,
    ],
  },
];
