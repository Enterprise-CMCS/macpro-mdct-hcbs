import { Accordion } from "@chakra-ui/react";
import {
  DateField,
  DropdownField,
  RadioField,
  TextAreaField,
  TextField,
} from "components/fields";
import { AccordionItem } from "components";

import {
  ButtonLinkElement,
  DividerElement,
  HeaderElement,
  NestedHeadingElement,
  ParagraphElement,
  SubHeaderElement,
  SubHeaderMeasureElement,
} from "components/report/Elements";
import { ElementType, HeaderIcon, NumberFieldTemplate } from "types";
import { ReactNode } from "react";

export const elementObject: {
  [key: string]: {
    description: string;
    variants: ReactNode[];
  };
} = {
  [ElementType.Header]: {
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
  [ElementType.SubHeader]: {
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
  [ElementType.NestedHeading]: {
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
  [ElementType.Textbox]: {
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
  [ElementType.TextAreaField]: {
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
  [ElementType.Paragraph]: {
    description: "A paragraph of text for content.",
    variants: [
      <ParagraphElement
        formkey="5418"
        element={{
          type: ElementType.Paragraph,
          id: "id-paragraph",
          text: "Useful for explanations or instructions.. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        }}
      />,
    ],
  },
  [ElementType.Divider]: {
    description: "A horizontal line to separate content",
    variants: [
      <DividerElement
        element={{
          type: ElementType.NestedHeading,
          id: "",
          text: "",
        }}
        formkey={""}
      />,
    ],
  },
  [ElementType.Accordion]: {
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
  [ElementType.Dropdown]: {
    description: "A dropdown field for selecting options",
    variants: [
      <DropdownField
        formkey="5419"
        element={{
          type: ElementType.Dropdown,
          id: "id-dropdown",
          label: "DropdownField",
          options: [
            { value: "Option 1", label: "Option 1" },
            { value: "Option 2", label: "Option 2" },
            { value: "Option 3", label: "Option 3" },
          ],
        }}
      />,
    ],
  },
  [ElementType.Radio]: {
    description: "A radio button field for selecting one option",
    variants: [
      <RadioField
        formkey="5420"
        element={{
          type: ElementType.Radio,
          id: "id-radio",
          label: "RadioField",
          choices: [
            { value: "Option 1", label: "Option 1" },
            { value: "Option 2", label: "Option 2" },
            { value: "Option 3", label: "Option 3" },
          ],
        }}
      />,
    ],
  },
  [ElementType.ButtonLink]: {
    description: "A button that acts as a link",
    variants: [
      <ButtonLinkElement
        formkey="5421"
        element={{
          type: ElementType.ButtonLink,
          id: "id-buttonlink",
          label: "ButtonLinkElement",
          to: "why-is-this-undefined-three-times",
        }}
      />,
    ],
  },
  [ElementType.Date]: {
    description: "A field for selecting a date",
    variants: [
      <DateField
        formkey="5422"
        element={{
          type: ElementType.Date,
          id: "id-date-field",
          label: "DateField",
          helperText: "DateFieldElement is used to select a date.",
        }}
      />,
    ],
  },
  ["SubHeaderMeasure"]: {
    description: "A subheader for measures",
    variants: [
      <SubHeaderMeasureElement
        formkey="5423"
        element={{
          type: ElementType.SubHeader,
          id: "id-subheader",
          text: "SubHeaderElement",
        }}
      />,
    ],
  },
  [ElementType.NumberField]: {
    description: "A field for entering numbers",
    variants: [
      <TextField
        formkey="5424"
        element={
          {
            type: ElementType.NumberField,
            id: "id-number-field",
            label: "Enter a number",
          } as NumberFieldTemplate
        }
      />,
    ],
  },
};
