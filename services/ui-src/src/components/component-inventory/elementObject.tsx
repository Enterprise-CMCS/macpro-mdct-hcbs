import {
  DateField,
  DropdownField,
  RadioField,
  TextAreaField,
  TextField,
} from "components/fields";
import { Accordion, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import {
  MeasureTableElement,
  AccordionItem,
  MeasureResultsNavigationTableElement,
  StatusTableElement,
  MeasureDetailsElement,
  MeasureFooterElement,
  Fields,
  NDRFields,
  NDREnhanced,
  NDR,
  NDRBasic,
  StatusAlert,
} from "components";

import {
  ButtonLinkElement,
  DividerElement,
  HeaderElement,
  NestedHeadingElement,
  ParagraphElement,
  SubHeaderElement,
  SubHeaderMeasureElement,
} from "components/report/Elements";
import {
  AlertTypes,
  ElementType,
  HeaderIcon,
  NumberFieldTemplate,
  PageElement,
} from "types";
import { ReactNode } from "react";
import { ExportedReportWrapper } from "components/export/ExportedReportWrapper";
import {
  textboxSection,
  textAreaSection,
  numberFieldSection,
  radioFieldSection,
  ndrFieldsSection,
  ndrEnhancedSection,
  ndrSection,
  ndrBasicSection,
  lengthOfStayRateSection,
  measureDetailsSection,
} from "./pdfElementSectionHelpers";
import { formatMonthDayYear } from "utils";
import { SubmissionParagraph } from "components/report/SubmissionParagraph";

// eslint-disable-next-line no-console
const logNewElement = (el: Partial<PageElement>) => console.log("Updated:", el);

export const elementObject: {
  [key: string]: {
    description: string;
    variants: ReactNode[];
    pdfVariants: ReactNode[];
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
    pdfVariants: [
      <HeaderElement
        element={{
          type: ElementType.Header,
          id: "id-header",
          text: "HeaderElement",
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
    pdfVariants: [
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
    pdfVariants: [
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
    pdfVariants: [<ExportedReportWrapper section={textboxSection} />],
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
    pdfVariants: [<ExportedReportWrapper section={textAreaSection} />],
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
    pdfVariants: ["Paragraph currently not used in PDFs"],
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
    pdfVariants: ["Divider currently not used in PDFs"],
  },
  [ElementType.Accordion]: {
    description: "A collapsible section for content",
    variants: [
      <Accordion allowToggle={true} defaultIndex={[-1]}>
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
    pdfVariants: ["Accordion currently not used in PDFs"],
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
    pdfVariants: ["Dropdown currently not used in PDFs"],
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
          required: true,
          choices: [
            { value: "radio option 1", label: "radio option 1" },
            { value: "radio option 2", label: "radio option 2" },
            { value: "radio option 3", label: "radio option 3" },
          ],
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={radioFieldSection} />],
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
    pdfVariants: [
      <Table variant={"reportDetails"}>
        <Thead>
          <Tr>
            <Th>Reporting year</Th>
            <Th>Last edited</Th>
            <Th>Edited by</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{2025}</Td>
            <Td>{formatMonthDayYear(1757897305331)}</Td>
            <Td>{"test user"}</Td>
            <Td>{"In progress"}</Td>
          </Tr>
        </Tbody>
      </Table>,
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
    pdfVariants: ["SubHeaderMeasure currently not used in PDFs"],
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
    pdfVariants: [<ExportedReportWrapper section={numberFieldSection} />],
  },
  // Elements that need a state
  [ElementType.SubHeaderMeasure]: {
    description: "A subheader for measures",
    variants: [
      <SubHeaderMeasureElement
        element={{
          type: ElementType.SubHeaderMeasure,
          id: "id-subheader-measure",
        }}
      />,
    ],
    pdfVariants: ["SubheaderMeasure currently not used in PDFs"],
  },
  [ElementType.ButtonLink]: {
    description: "A link styled as a button",
    variants: [
      <ButtonLinkElement
        element={{
          type: ElementType.ButtonLink,
          id: "id-button-link",
          label: "Button Link Label",
        }}
      />,
    ],
    pdfVariants: ["Buttonlink currently not used in PDFs"],
  },
  [ElementType.MeasureTable]: {
    description: "A table for displaying measure status with navigation",
    variants: [
      <MeasureTableElement
        element={{
          type: ElementType.MeasureTable,
          id: "id-measure-table",
          measureDisplay: "required",
        }}
      />,
    ],
    pdfVariants: ["MeasureTable currently not used in PDFs"],
  },
  [ElementType.MeasureResultsNavigationTable]: {
    description: "A table for displaying measure results with navigation",
    variants: [
      <MeasureResultsNavigationTableElement
        element={{
          type: ElementType.MeasureResultsNavigationTable,
          measureDisplay: "quality",
          id: "id-measure-results-navigation-table",
        }}
      />,
    ],
    pdfVariants: ["MeasureResultsNavigationTable currently not used in PDFs"],
  },
  [ElementType.StatusTable]: {
    description: "A table for displaying measure status",
    variants: [<StatusTableElement />],
    pdfVariants: ["StatusTable currently not used in PDFs"],
  },
  [ElementType.MeasureDetails]: {
    description: "Displaying measure details",
    variants: [<MeasureDetailsElement />],
    pdfVariants: [<ExportedReportWrapper section={measureDetailsSection} />],
  },
  [ElementType.MeasureFooter]: {
    description: "Measure footer for navigation and submission",
    variants: [
      <MeasureFooterElement
        element={{
          type: ElementType.MeasureFooter,
          id: "measure-footer",
          completeMeasure: true,
          clear: true,
        }}
      />,
      <MeasureFooterElement
        element={{
          type: ElementType.MeasureFooter,
          id: "measure-footer",
          prevTo: "LTSS-1",
          nextTo: "LTSS-2",
          completeSection: true,
        }}
      />,
    ],
    pdfVariants: ["MeasureFooter currently not used in PDFs"],
  },
  [ElementType.LengthOfStayRate]: {
    description:
      "Numerator/Denominator Fields to gather LengthOfStayRate performance rates",
    variants: [
      <Fields
        updateElement={logNewElement}
        element={{
          type: ElementType.LengthOfStayRate,
          id: "measure-rates",
          labels: {
            performanceTarget: "performanceTarget",
            actualCount: "actualCount",
            denominator: "denominator",
            expectedCount: "expectedCount",
            populationRate: "populationRate",
            actualRate: "actualRate",
            expectedRate: "expectedRate",
            adjustedRate: "adjustedRate",
          },
          required: true,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={lengthOfStayRateSection} />],
  },
  [ElementType.NdrFields]: {
    description: "Numerator/Denominator Fields to gather performance rates",
    variants: [
      <NDRFields
        updateElement={logNewElement}
        element={{
          type: ElementType.NdrFields,
          id: "measure-rates",
          labelTemplate: "Label",
          assessments: [
            { id: "assessment-1", label: "First Assessment" },
            { id: "assessment-2", label: "Second Assessment" },
          ],
          fields: [
            { id: "field-1", label: "First Field" },
            { id: "field-2", label: "Second Field" },
          ],
          required: true,
          multiplier: 1000,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={ndrFieldsSection} />],
  },
  [ElementType.NdrEnhanced]: {
    description:
      "Enhanced Numerator/Denominator Fields to gather performance rates",
    variants: [
      <NDREnhanced
        updateElement={logNewElement}
        element={{
          type: ElementType.NdrEnhanced,
          id: "measure-rates",
          performanceTargetLabel: "Label",
          assessments: [
            { id: "assessment-1", label: "First Assessment" },
            { id: "assessment-2", label: "Second Assessment" },
          ],
          required: true,
          helperText: "Helper text",
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={ndrEnhancedSection} />],
  },
  [ElementType.Ndr]: {
    description: "Numerator/Denominator Fields to gather performance rates",
    variants: [
      <NDR
        updateElement={logNewElement}
        element={{
          type: ElementType.Ndr,
          id: "measure-rates",
          performanceTargetLabel: "performanceTargetLabel",
          label: "Label",
          required: true,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={ndrSection} />],
  },
  [ElementType.NdrBasic]: {
    description:
      "Basic and minimum target Numerator/Denominator Fields to gather performance rates",
    variants: [
      <NDRBasic
        updateElement={logNewElement}
        element={{
          type: ElementType.NdrBasic,
          id: "measure-rates",
          label: "Label",
          required: true,
          hintText: {
            numHint: "numHint",
            denomHint: "denomHint",
            rateHint: "rateHint",
          },
          multiplier: 100,
          displayRateAsPercent: true,
        }}
      />,
      <NDRBasic
        updateElement={logNewElement}
        element={{
          type: ElementType.NdrBasic,
          id: "measure-rates",
          label: "Label",
          required: true,
          hintText: {
            numHint: "numHint",
            denomHint: "denomHint",
            rateHint: "rateHint",
          },
          multiplier: 100,
          displayRateAsPercent: true,
          minPerformanceLevel: 90,
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={ndrBasicSection} />],
  },
  [ElementType.StatusAlert]: {
    description: "Different Alert Types",
    variants: [
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "measure-rates",
          title: "Status Title",
          text: "AlertTypes.SUCCESS",
          status: AlertTypes.SUCCESS,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "measure-rates",
          title: "Status Title",
          text: "AlertTypes.ERROR",
          status: AlertTypes.ERROR,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "measure-rates",
          title: "Status Title",
          text: "AlertTypes.INFO",
          status: AlertTypes.INFO,
        }}
      />,
      <StatusAlert
        element={{
          type: ElementType.StatusAlert,
          id: "measure-rates",
          title: "Status Title",
          text: "AlertTypes.WARNING",
          status: AlertTypes.WARNING,
        }}
      />,
    ],
    pdfVariants: ["StatusAlert currently not used in PDFs"],
  },
  [ElementType.SubmissionParagraph]: {
    description: "Submission Paragraph",
    variants: [<SubmissionParagraph />],
    pdfVariants: ["SubmissionParagraph currently not used in PDFs"],
  },
};
