import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
} from "../../../types/reports";

export const taReportTemplate: ReportBase = {
  type: ReportType.TA,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "hapch-1", "hapch-2", "review-submit"],
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
      id: "hapch-1",
      title: "HCBS HAPCH-1",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "hapch-1-header",
          text: "HCBS HAPCH-1: Time from initial approval of personal care, homemaker, home health Aide, and habilitation services to when services began",
        },
        {
          type: ElementType.Accordion,
          id: "hapch-1-instructions",
          label: "Instructions",
          value: "[Instructions to follow]",
        },
      ],
    },
    {
      id: "hapch-2",
      title: "HCBS HAPCH-2",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "hapch-2-header",
          text: "HCBS HAPCH-2: Authorized Hours for Homemaker Services, Home Health Aide Services, Personal Care, or Habilitation Services That Were Provided",
        },
        {
          type: ElementType.Accordion,
          id: "hapch-2-instructions",
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
          text: "Some sections of the TACM Report have errors or are missing required responses. Ensure all required and in-progress measures are completed with valid responses before submitting. If an optional measure is showing as ‘in-progress’ and you do not want to complete that measure, go into the measure and clear the data to reset it.",
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
          text: "Double check that everything in your TACM Report is accurate. To make edits to your report after submitting, contact your CMS HCBS Lead to unlock your report.",
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
          text: "Email your CMS representative to inform them you submitted the TACM Report and it is ready for their review.",
        },
      ],
    },
  ],
};
