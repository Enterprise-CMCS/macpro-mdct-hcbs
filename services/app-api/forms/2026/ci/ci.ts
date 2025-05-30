import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
} from "../../../types/reports";

export const ciReportTemplate: ReportBase = {
  type: ReportType.CI,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "incid-1",
        "incid-2",
        "incid-2",
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
      id: "incid-1",
      title: "HCBS INCID-1",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "incid-1-header",
          text: "HCBS HAPCH-1: Critical Incidents for which an investigation was initiated within state-specified timeframes",
        },
        {
          type: ElementType.Accordion,
          id: "incid-1-instructions",
          label: "Instructions",
          value: "[Instructions to follow]",
        },
      ],
    },
    {
      id: "incid-2",
      title: "HCBS INCID-2",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "incid-2-header",
          text: "HCBS INCID-2: Critical Incidents for Which the State Determined the Resolution within State-specified Timeframes",
        },
        {
          type: ElementType.Accordion,
          id: "incid-2-instructions",
          label: "Instructions",
          value: "[Instructions to follow]",
        },
      ],
    },
    {
      id: "incid-3",
      title: "HCBS INCID-3",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "incid-3-header",
          text: "HCBS INCID-3: Critical Incidents Requiring Corrective Action for Which the Required Corrective Action Was Completed Within State-Specified Timeframes",
        },
        {
          type: ElementType.Accordion,
          id: "incid-3-instructions",
          label: "Instructions",
          value: "[Instructions to follow]",
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
          status: "error",
          title: "Your form is not ready for submission",
          text: "Some sections of the CICM Report have errors or are missing required responses. Ensure all required and in-progress measures are completed with valid responses before submitting. If an optional measure is showing as ‘in-progress’ and you do not want to complete that measure, go into the measure and clear the data to reset it.",
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
          text: "Double check that everything in your CICM Report is accurate. To make edits to your report after submitting, contact your CMS HCBS Lead to unlock your report.",
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
          text: "Email your CMS representative to inform them you submitted the CICM Report and it is ready for their review.",
        },
      ],
    },
  ],
};
