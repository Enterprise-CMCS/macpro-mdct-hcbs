import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
  AlertTypes,
} from "../../../types/reports";
import { exportToPDF } from "../elements";

export const qipReportTemplate: ReportBase = {
  type: ReportType.QIP,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "plan-overview",
        "plan-details",
        "review-submit",
      ],
    },
    {
      id: "general-info",
      navTitle: "General Information",
      tabTitle: "General Information - QIP - HCBS",
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
          label: "Contact name/title",
          required: true,
          helperText:
            "Provide name, title, and email of the primary point of contact for follow-up regarding this QIP submission.",
        },
        {
          type: ElementType.Textbox,
          id: "contact-email",
          label: "Contact email",
          required: true,
          helperText:
            "Enter an email address for the person or position above. Department or program-wide email addresses are allowed.",
        },
        {
          type: ElementType.Textbox,
          id: "lead-agency-division",
          label: "Lead Agency/Division responsible",
          required: true,
          helperText:
            "Identify the lead state agency or division responsible for this plan.",
        },
        {
          type: ElementType.Checkbox,
          id: "waivers-list-checkboxes",
          label:
            "Select all HCBS authorities included in this quality improvement plan for this reporting period.",
          choices: [
            /* Generated in buildReport, with data from waivers.ts */
          ],
          helperText: "Select all that apply.",
          emptyAlertTitle:
            "No programs or waivers found for your state/territory",
          emptyAlertDescription:
            "If you believe this is in error please contact the MDCT Help Desk: mdct_help@cms.hhs.gov",
          required: false,
        },
        {
          type: ElementType.ListInput,
          id: "waivers-list-inputs",
          label:
            "If an HCBS authority is not included above, but included in this QIP, add its name and control number here.",
          fieldLabel: "Name and control number (if applicable)",
          buttonText: "Add HCBS authority",
          required: false,
        },
      ],
    },
    {
      id: "plan-overview",
      navTitle: "QI Plan Overview",
      tabTitle: "Quality Improvement Plan Overview - QIP - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "plan-overview-header",
          text: "Quality Improvement Plan Overview",
        },
        {
          type: ElementType.TextAreaField,
          id: "strategy-description",
          label: "Strategy description",
          helperText:
            "Describe the planned intervention(s), relevant partners, populations affected, and the rationale for the strategy (500 words).",
          wordLimit: 500,
          required: true,
        },
        {
          type: ElementType.Date,
          id: "start-date",
          label: "Start date",
          helperText:
            "Enter a projected start date for future strategies or enter a past start date for strategies in progress.",
          dateFormat: "MMYYYY",
          required: true,
        },
        {
          type: ElementType.Date,
          id: "end-date",
          label: "Projected end date",
          helperText:
            "Enter a projected end date or leave blank if the strategy will be ongoing without a set end point.",
          dateFormat: "MMYYYY",
          required: false,
        },
      ],
    },
    {
      id: "plan-details",
      navTitle: "QI Plan Details",
      tabTitle: "Quality Improvement Plan Details - QIP - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "plan-details-header",
          text: "Quality Improvement Plan Details",
        },
        {
          type: ElementType.Accordion,
          id: "qip-details-instructions",
          label: "Instructions",
          value:
            "<p>Provide comprehensive details on how this Quality Improvement Plan is monitored, evaluated, and sustained.</p>" +
            "<b>Complete the Mandatory Sections:</b>" +
            "<ul>" +
            "  <li><b>Monitoring Approach:</b> Describe the tracking mechanisms, tools, or oversight processes used to monitor ongoing progress toward your performance targets.</li>" +
            "  <li><b>Evaluation Summary:</b> Detail the strategy's specific success criteria, the data sources utilized, and how frequently the data is reviewed.</li>" +
            "</ul>" +
            "<p>Word Count Note: Each text narrative should be concise yet thorough, aiming for approximately 250 to 300 words</p>",
        },
        {
          type: ElementType.TextAreaField,
          id: "monitoring-approach",
          label: "Monitoring approach",
          helperText:
            "Briefly describe the tracking used to monitor progress toward the performance target (250-300 words).",
          wordLimit: 300,
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "evaluation-summary",
          label: "Evaluation summary",
          helperText:
            "Briefly describe the strategy’s success criteria, data sources, and frequency of review (250-300 words). ",
          wordLimit: 300,
          required: true,
        },
      ],
    },
    {
      id: "review-submit",
      navTitle: "Review & Submit",
      tabTitle: "Review & Submit - QIP - HCBS",
      submittedTabTitle: "Successfully Submitted - QIP - HCBS",
      type: PageType.ReviewSubmit,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.StatusAlert,
          id: "review-alert",
          status: AlertTypes.ERROR,
          title: "Your form is not ready for submission",
          text: "Some sections of the report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
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
          text: "Double check that everything in your QMS QIP is accurate. Once you submit, you will only be able to make edits by contacting your CMS HCBS lead to unlock your report.",
        },
        {
          type: ElementType.Paragraph,
          id: "review-compliance",
          title: "Compliance review",
          text: "Your CMS HCBS Lead will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
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
          text: "Your report has been submitted and is now locked from editing.",
        },
        {
          type: ElementType.Paragraph,
          weight: "bold",
          id: "submitted-what-happens",
          text: 'Email <a href="mailto:HCBSQuality@cms.hhs.gov" class="parsed-html-link">HCBSQuality@cms.hhs.gov</a> to inform CMS that this Quality Improvement Plan has been submitted.',
        },
        exportToPDF,
      ],
    },
  ],
};
