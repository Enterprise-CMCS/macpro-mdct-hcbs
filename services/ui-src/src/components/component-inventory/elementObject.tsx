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
  CheckboxField,
  EligibilityTableElement,
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
  EligibilityTableSection,
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
    id?: string;
  };
} = {
  [ElementType.Header]: {
    description: "Big text at the top of the page",
    id: "id-header",
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
    id: "id-subheader",
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
    id: "id-nested-heading",
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
    id: "id-textfield",
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
    id: "id-textareafield",
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
    id: "id-paragraph",
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
    id: "id-divider",
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
    id: "id-accordion",
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
    id: "id-dropdown-field",
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
    id: "id-radio-field",
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
    id: "id-date-field",
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
    id: "id-subheader-measure",
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
    id: "id-number-field",
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
    id: "id-subheader-measure",
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
    id: "id-button-link",
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
    id: "id-measure-table",
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
    id: "id-measure-results-navigation-table",
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
    id: "id-status-table",
    variants: [<StatusTableElement />],
    pdfVariants: ["StatusTable currently not used in PDFs"],
  },
  [ElementType.MeasureDetails]: {
    description: "Displaying measure details",
    id: "id-measure-details",
    variants: [<MeasureDetailsElement />],
    pdfVariants: [<ExportedReportWrapper section={measureDetailsSection} />],
  },
  [ElementType.MeasureFooter]: {
    description: "Measure footer for navigation and submission",
    id: "id-measure-footer",
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
    id: "id-length-of-stay-rate",
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
    id: "id-ndr-fields",
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
    id: "id-ndr-enhanced",
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
    id: "id-ndr",
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
    id: "id-ndr-basic",
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
    id: "id-status-alert",
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
    id: "id-submission-paragraph",
    variants: [<SubmissionParagraph />],
    pdfVariants: ["SubmissionParagraph currently not used in PDFs"],
  },
  [ElementType.Checkbox]: {
    description: "A checkbox field for selecting options",
    id: "id-checkbox",
    variants: [
      <CheckboxField
        updateElement={logNewElement}
        element={{
          type: ElementType.Checkbox,
          id: "id-checkbox",
          label: "CheckboxField",
          required: true,
          choices: [
            { value: "checkbox option 1", label: "checkbox option 1" },
            { value: "checkbox option 2", label: "checkbox option 2" },
            { value: "checkbox option 3", label: "checkbox option 3" },
          ],
        }}
      />,
    ],
    pdfVariants: ["Checkbox currently not used in PDFs"],
  },
  [ElementType.EligibilityTable]: {
    description: "Eligibility Table for WWL report",
    id: "id-eligibility-table",
    variants: [
      <EligibilityTableElement
        updateElement={logNewElement}
        element={{
          type: ElementType.EligibilityTable,
          id: "id-eligibility-table",
          answer: [
            {
              title: "string",
              description: "string",
              recheck: "Yes",
              frequency: "Annually",
              eligibilityUpdate: "No",
            },
          ],
        }}
      />,
    ],
    pdfVariants: [<ExportedReportWrapper section={EligibilityTableSection} />],
  },
};
