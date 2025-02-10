import {
  ReportTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
  MeasurePageTemplate,
} from "../types/reports";
import { defaultMeasures, defaultMeasureTemplates } from "./defaultMeasures";
import { pomMeasures, pomMeasureTemplates } from "./pomMeasures";

export const qmsReportTemplate: ReportTemplate = {
  type: ReportType.QMS,
  title: "plan id",
  year: 2026,
  options: {},
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "req-measure-result",
        "optional-measure-result",
        "review-submit",
      ],
    },
    {
      id: "general-info",
      title: "General Information",
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
    {
      id: "req-measure-result",
      title: "Required Measure Results",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Required Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          measureDisplay: "required",
        },
      ],
    },
    {
      id: "req-measure-result-modal",
      title: "Select measure",
      sidebar: true,
      type: PageType.Modal,
      elements: [
        {
          type: ElementType.Header,
          text: "Select measure",
        },
        {
          type: ElementType.Paragraph,
          text: "Select the correct version of the quality measure.",
        },
        {
          type: ElementType.Radio,
          label: "Which quality measure will be reported?",
          value: [
            {
              label: "{Measure name version 1}",
              value: "measure-1",
            },
            {
              label: "{Measure name version 2}",
              value: "measure-2",
            },
          ],
        },
      ],
    },
    {
      id: "optional-measure-result",
      title: "Optional Measure Results",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Optional Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          measureDisplay: "optional",
        },
      ],
    },
    {
      id: "review-submit",
      title: "Review & Submit",
      type: PageType.Standard,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Review & Submit",
        },
        {
          type: ElementType.Paragraph,
          title: "Ready to Submit?",
          text: "Double check that everything in your QMS Report is accurate. You will be able to make edits after submitting if you contact your [CMS representative] to unlock your report while it is in “Submitted” status.",
        },
        {
          type: ElementType.Paragraph,
          title: "Compliance review",
          text: "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
        {
          type: ElementType.StatusTable,
          to: "review-submit",
        },
      ],
    },
  ],
  measureLookup: {
    // TODO: what is a default measure and are there any other kinds of measures?
    defaultMeasures: defaultMeasures,
    pomMeasures: pomMeasures,
  },
  measureTemplates: {
    ...defaultMeasureTemplates,
    ...pomMeasureTemplates,
  } as Record<MeasureTemplateName, MeasurePageTemplate>,
};
