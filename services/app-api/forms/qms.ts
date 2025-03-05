import {
  ReportTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
  MeasurePageTemplate,
} from "../types/reports";
import { defaultMeasures, pomMeasures } from "./measureOptions";
import { measureTemplates } from "./measureTemplates";

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
          id: "general-info-header",
          text: "General Information",
        },
        {
          id: "contact-name",
          type: ElementType.Textbox,
          label: "Contact name",
          helperText:
            "Enter person's name or a position title for CMS to contact with questions about this report.",
        },
        {
          type: ElementType.Textbox,
          id: "contact-email",
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
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
          id: "required-header",
          text: "Required Measure Results",
        },
        {
          type: ElementType.Accordion,
          id: "required-instructions",
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          id: "required-measures",
          measureDisplay: "required",
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
          id: "optional-header",
          text: "Optional Measure Results",
        },
        {
          type: ElementType.Accordion,
          id: "optional-instructions",
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          id: "optional-measures",
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
          id: "review-header",
          text: "Review & Submit",
        },
        {
          type: ElementType.Paragraph,
          id: "review-text",
          title: "Ready to Submit?",
          text: "Double check that everything in your QMS Report is accurate. You will be able to make edits after submitting if you contact your [CMS representative] to unlock your report while it is in “Submitted” status.",
        },
        {
          type: ElementType.Paragraph,
          id: "review-compliance",
          title: "Compliance review",
          text: "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
        {
          type: ElementType.StatusTable,
          id: "review-status",
          to: "review-submit",
        },
      ],
    },
  ],
  measureLookup: {
    defaultMeasures: defaultMeasures,
    pomMeasures: pomMeasures,
  },
  // Note: These measure page templates do _not_ have `cmitId` or `status` properties.
  measureTemplates: measureTemplates as Record<
    MeasureTemplateName,
    MeasurePageTemplate
  >,
};
