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
  DividerElement,
  HeaderElement,
  NestedHeadingElement,
  ParagraphElement,
  SubHeaderElement,
  SubHeaderMeasureElement,
} from "components/report/Elements";
import {
  ElementType,
  HeaderIcon,
  NumberFieldTemplate,
  PageElement,
} from "types";
import { ReactNode } from "react";

// eslint-disable-next-line no-console
const logNewElement = (el: Partial<PageElement>) => console.log("Updated:", el);

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
        element={{
          type: ElementType.Header,
          id: "id-header",
          text: "HeaderElement",
        }}
      />,
      <HeaderElement
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
        updateElement={logNewElement}
        element={{
          type: ElementType.Textbox,
          id: "id-textfield",
          label: "TextField",
          required: false,
        }}
      />,
    ],
  },
  [ElementType.TextAreaField]: {
    description: "A field for entering text",
    variants: [
      <TextAreaField
        updateElement={logNewElement}
        element={{
          type: ElementType.TextAreaField,
          id: "id-textareafield",
          label: "TextAreaField",
          required: true,
        }}
      />,
    ],
  },
  [ElementType.Paragraph]: {
    description: "A paragraph of text for content.",
    variants: [
      <ParagraphElement
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
          type: ElementType.Divider,
          id: "id-divider",
        }}
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
        updateElement={logNewElement}
        element={{
          type: ElementType.Dropdown,
          id: "id-dropdown",
          label: "DropdownField",
          required: true,
          options: [
            { value: "dropdown option 1", label: "dropdown option 1" },
            { value: "dropdown option 2", label: "dropdown option 2" },
            { value: "dropdown option 3", label: "dropdown option 3" },
          ],
        }}
      />,
    ],
  },
  [ElementType.Radio]: {
    description: "A radio button field for selecting one option",
    variants: [
      <RadioField
        updateElement={logNewElement}
        element={{
          type: ElementType.Radio,
          id: "id-radio",
          label: "RadioField",
          choices: [
            { value: "radio option 1", label: "radio option 1" },
            { value: "radio option 2", label: "radio option 2" },
            { value: "radio option 3", label: "radio option 3" },
          ],
        }}
      />,
    ],
  },
  [ElementType.Date]: {
    description: "A field for selecting a date",
    variants: [
      <DateField
        updateElement={logNewElement}
        element={{
          type: ElementType.Date,
          id: "id-date-field",
          label: "DateField",
          helperText: "DateFieldElement is used to select a date.",
          required: true,
        }}
      />,
    ],
  },
  ["SubHeaderMeasure"]: {
    description: "A subheader for measures",
    variants: [
      <SubHeaderMeasureElement
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
        updateElement={logNewElement}
        element={
          {
            type: ElementType.NumberField,
            id: "id-number-field",
            label: "Enter a number",
            helperText: "Helper text is optional",
            required: false,
          } as NumberFieldTemplate
        }
      />,
      <TextField
        updateElement={logNewElement}
        element={
          {
            type: ElementType.NumberField,
            id: "id-number-field-required",
            label: "NumberField with required validation",
            helperText: "This field is required.",
            required: true,
          } as NumberFieldTemplate
        }
      />,
    ],
  },
  // ButtonLinkElement needs ReportType, state, and reportId
};
