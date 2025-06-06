import { qmsReportTemplate as qmsReportTemplate2026 } from "../../forms/2026/qms/qms";
import {
  Report,
  PageType,
  ElementType,
  MeasureTemplateName,
  ReportStatus,
} from "../../types/reports";

const qmsReportTemplate = qmsReportTemplate2026;

export const validReport: Report = {
  type: qmsReportTemplate.type,
  year: qmsReportTemplate.year,
  pages: qmsReportTemplate.pages,
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
  archived: false,
  submissionCount: 0,
  options: {},
};

export const missingStateReport = {
  ...validReport,
  state: undefined,
};

export const incorrectStatusReport = {
  ...validReport,
  status: "wrong value", // Doesn't use ReportStatus enum
};

export const incorrectTypeReport = {
  ...validReport,
  type: "wrong type", // Doesn't use ReportType enum
};

export const invalidFormPageReport = {
  ...validReport,
  pages: [
    {
      id: "general-info",
      // missing title field
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.SubHeader,
          text: "State of Program Information",
        },
        {
          type: ElementType.Textbox,
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
        {
          type: ElementType.Date,
          label: "Reporting period start date",
          helperText:
            "What is the reporting period Start Date applicable to the measure results?",
        },
        {
          type: ElementType.Date,
          label: "Reporting period end date",
          helperText:
            "What is the reporting period End Date applicable to the measure results?",
        },
      ],
    },
  ],
};

export const invalidMeasurePageReport = {
  ...validReport,
  pages: [
    {
      id: "my-measure",
      // missing title field
      type: PageType.Measure,
      cmitId: "abc",
      required: true,
      substitutable: true,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.SubHeader,
          text: "State of Program Information",
        },
        {
          type: ElementType.Textbox,
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
        {
          type: ElementType.Date,
          label: "Reporting period start date",
          helperText:
            "What is the reporting period Start Date applicable to the measure results?",
        },
        {
          type: ElementType.Date,
          label: "Reporting period end date",
          helperText:
            "What is the reporting period End Date applicable to the measure results?",
        },
      ],
    },
  ],
};

export const invalidParentPageReport = {
  ...validReport,
  pages: [
    {
      // missing id field
      childPageIds: [
        "general-info",
        "req-measure-result",
        "optional-measure-result",
        "review-submit",
      ],
    },
  ],
};

export const invalidRadioCheckedChildrenReport = {
  ...validReport,
  pages: {
    ...qmsReportTemplate.measureTemplates,
    [MeasureTemplateName["LTSS-1"]]: {
      id: "LTSS-1",
      title: "LTSS-1: Comprehensive Assessment and Update",
      type: PageType.Measure,
      substitutable: MeasureTemplateName["FASI-1"],
      sidebar: false,
      elements: [
        {
          type: ElementType.Radio,
          label: "Were the reported measure results audited or validated?",
          choices: [
            { label: "No, I am reporting on this measure", value: "no" },
            {
              label: "Yes, CMS is reporting on my behalf",
              value: "yes",
              checkedChildren: [
                {
                  //   type: ElementType.Textbox,
                  label:
                    "What is the name of the agency or entity that audited or validated the report?",
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export const invalidPageElementType = {
  ...validReport,
  pages: [
    {
      id: "general-info",
      title: "General Info",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: "badElementType", // Doesn't use ElementType enum
          text: "State of Program Information",
        },
      ],
    },
  ],
};
