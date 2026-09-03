import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
  AlertTypes,
} from "../../../types/reports";
import {
  exportToPDF,
  waiverListCheckboxField,
  waiverListInputField,
} from "../elements";
import { CRITICAL_INCIDENT_TYPES } from "./incidentTypes";

export const imaReportTemplate: ReportBase = {
  type: ReportType.IMA,
  year: 2028,
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "critical-incident-definition",
        "review-submit",
      ],
    },
    {
      id: "general-info",
      navTitle: "General Information",
      tabTitle: "General Information - IMA - HCBS",
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
        waiverListCheckboxField,
        waiverListInputField,
      ],
    },
    {
      id: "critical-incident-definition",
      navTitle: "Critical Incident Definition",
      tabTitle: "Critical Incident Definition - IMA - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "critical-incident-definition-header",
          text: "Critical Incident Definition",
        },
        {
          type: ElementType.Paragraph,
          id: "description-text",
          text: "States will use the information provided in their Access Rule IM System Assessment Tool(s) to complete the Access Rule IM System Reporting Template.",
        },
        {
          id: "instructions-accordion",
          type: ElementType.Accordion,
          label: "Instructions",
          value:
            "<p>" +
            "  If your state uses multiple incident management systems, you will need to complete a separate assessment tool for each unique system." +
            "</p>",
        },
        {
          type: ElementType.ImaTable,
          id: "critical-incident-definition-table",
          caption: "Critical Incident Definition Table",
          label:
            "3.   Do ALL the HCBS program(s) under this IM system include the following incident types in their definition of critical incidents?",
          helperText:
            'If some programs include the incident type but others do not, select "No".',
          allowCustomRows: true,
          addButtonText: "Add Other Incident Type",
          customRowLabel: "Other incident type:",
          errorMessage: "Not compliant.",
          columns: [
            { id: "ima-description", label: "Incident type" },
            { id: "ima-radio-yes", label: "Yes" },
            { id: "ima-radio-no", label: "No" },
            { id: "ima-delete", label: "Delete" },
          ],
          rows: CRITICAL_INCIDENT_TYPES,
        },
        {
          type: ElementType.Divider,
          id: "divider",
        },
        {
          type: ElementType.StatusAlert,
          id: "review-alert",
          status: AlertTypes.WARNING,
          title: "Warning Status",
          text: "The State does not meet the requirement.",
        },
        {
          type: ElementType.Paragraph,
          id: "reporting-requirement-text",
          title: "Reporting Requirement",
          text: "To be found in compliance, all HCBS programs under this IM system must define critical incidents to include all incident types listed above.",
        },
        {
          type: ElementType.TextAreaField,
          id: "noncompliance-justification",
          label: "State Justification for Noncompliance:",
          required: false,
        },
        {
          type: ElementType.TextAreaField,
          id: "timeline-justification",
          label:
            "State Actions and Timeline Required to Fully Demonstrate Compliance:",
          required: false,
        },
      ],
    },
    {
      id: "review-submit",
      navTitle: "Review & Submit",
      tabTitle: "Review & Submit - IMA - HCBS",
      submittedTabTitle: "Successfully Submitted - IMA - HCBS",
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
          text: 'Double check that everything in your report is accurate. Once your report is submitted and in "Submitted" status, your report will lock. To make edits after submitting, you will need to contact your CMS HCBS Lead to unlock your report.',
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
          text: 'Your dashboard will indicate the status of this report as "Submitted". Your report is now locked from editing.',
        },
        {
          type: ElementType.Paragraph,
          weight: "bold",
          id: "submitted-what-happens",
          text: "Email your CMS representative to inform them that you have submitted the report and it is ready for their review.",
        },
        exportToPDF,
      ],
    },
  ],
};
