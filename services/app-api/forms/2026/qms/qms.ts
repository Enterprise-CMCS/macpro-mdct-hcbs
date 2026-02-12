import {
  ReportWithMeasuresTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
  MeasurePageTemplate,
  HeaderIcon,
  AlertTypes,
} from "../../../types/reports";
import { exportToPDF } from "../elements";
import { defaultMeasures, pomMeasures } from "./measureOptions";
import { measureTemplates } from "./measureTemplates";

export const qmsReportTemplate: ReportWithMeasuresTemplate = {
  type: ReportType.QMS,
  year: 2026,
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
          required: true,
          helperText:
            "Enter a person's name or a position title for CMS to contact with questions about this report.",
        },
        {
          type: ElementType.Textbox,
          id: "contact-email",
          label: "Contact email address",
          required: true,
          helperText:
            "Enter an email address for the person or position above.  Department or program-wide email addresses are allowed.",
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
          value:
            "<b>Instructions for Completing the QMS Report</b>" +
            "<p>Below is a list of all required measures. Select the respective “Start” or “Edit” buttons to navigate to each measure overview page and begin filling in all required fields. Once all required fields are completed for the measure, and any associated sub-measure sections, the “Complete Measure” button will become active. Clicking the button will complete the measure and place it in the <b>Complete</b> status.</p>" +
            "<p><b>Understanding Measure Statuses </b></p>" +
            "<ul>" +
            "  <li><b>Not started</b>: No data has been entered or actions taken on the measure.</li>" +
            "  <li><b>In progress</b>: The measure is actively being worked on, with some or all data entered.</li>" +
            "  <li><b>Complete</b>: The measure has been completed.</li>" +
            "</ul>" +
            "<p>Before submitting this form, all required measures must be in the <b>Complete</b> status.</p>",
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
          value:
            "<b>Instructions for Completing the QMS Report</b>" +
            "<p>Below is a list of all optional measures. Select the respective “Start” or “Edit” buttons to navigate to each measure overview page and begin filling in all required fields. Once all required fields are completed for the measure, and any associated sub-measure sections, the “Complete Measure” button will become active. Clicking the button will complete the measure and place it in the <b>Complete</b> status.</p>" +
            "<p>Please note, the report cannot be submitted as long as any optional measures remain in the <b>In Progress</b> status. If you do not wish to complete an optional measure, you may clear the measure details which will return the measure to the <b>Not started</b> status.</p>" +
            "<p><b>Understanding Measure Statuses </b></p>" +
            "<ul>" +
            "  <li><b>Not started</b>: No data has been entered or actions taken on the measure.</li>" +
            "  <li><b>In progress</b>: The measure is actively being worked on, with some or all data entered.</li>" +
            "  <li><b>Complete</b>: The measure has been completed.</li>" +
            "</ul>" +
            "<p>Before submitting this form, all required measures must be in the <b>Complete</b> status.</p>",
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
      type: PageType.ReviewSubmit,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.StatusAlert,
          id: "review-alert",
          status: AlertTypes.ERROR,
          title: "Your form is not ready for submission",
          text: "Some sections of the QMS Report have errors or are missing required responses. Ensure all required and in-progress measures are completed with valid responses before submitting. If an optional measure is showing as ‘in-progress’ and you do not want to complete that measure, go into the measure and clear the data to reset it.",
        },
        {
          type: ElementType.Header,
          id: "review-header",
          text: "Review & Submit",
        },
        {
          type: ElementType.Paragraph,
          id: "review-text",
          title: "Ready to submit?",
          text: "Double check that everything in your QMS Report is accurate. To make edits to your report after submitting, contact your CMS HCBS Lead to unlock your report.",
        },
        {
          type: ElementType.Paragraph,
          id: "review-compliance",
          title: "Compliance review",
          text: "Your CMS HCBS Lead will review your report and may unlock it for editing if corrections are needed.",
        },
        {
          type: ElementType.StatusTable,
          id: "review-status",
          to: "review-submit",
        },
      ],
      submittedView: [
        {
          type: ElementType.Header,
          id: "submitted-header",
          text: "Successfully Submitted",
          icon: HeaderIcon.Check,
        },
        {
          type: ElementType.SubmissionParagraph,
          id: "submitted-thank-you",
        },
        {
          type: ElementType.Divider,
          id: "divider",
        },
        {
          type: ElementType.Paragraph,
          id: "submitted-what-explanation",
          title: "What happens now?",
          text: 'Your dashboard will indicate the status of this report as "Submitted" and and it is now locked from editing.',
        },
        {
          type: ElementType.Paragraph,
          weight: "bold",
          id: "submitted-what-happens",
          text: "Email your CMS representative to inform them you submitted the QMS Report and it is ready for their review.",
        },
        exportToPDF,
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
