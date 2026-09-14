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
        "critical-incident-definitions",
        "electronic-info-system",
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
          label: "Contact name/title",
          required: true,
          helperText:
            "Provide name and/or title of the primary point of contact for follow-up regarding this assessment.",
        },
        {
          type: ElementType.Textbox,
          id: "contact-email",
          label: "Contact email address",
          required: true,
          helperText:
            "Enter an email address for the person or position above. Department or program-wide email addresses are allowed.",
        },
        {
          ...waiverListCheckboxField,
          label:
            "Select all HCBS authorities included in this incident management assessment for this reporting period.",
        },
        {
          ...waiverListInputField,
          label:
            "If an HCBS authority is not included above, but included in this IMA, add its name and control number here.",
        },
      ],
    },
    {
      id: "critical-incident-definitions",
      navTitle: "Critical Incident Definitions",
      tabTitle: "Critical Incident Definitions - IMA - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "critical-incident-definitions-header",
          text: "Critical incident definitions",
        },
        {
          type: ElementType.ImaTable,
          id: "critical-incident-definitions-table",
          caption: "Critical Incident Definitions Table",
          label:
            "Do all HCBS programs under this IM system define critical incidents to include the following incident types?",
          helperText:
            "If some programs include the incident type but others do not, select “No.”",
          allowUserCreatedRows: true,
          addButtonText: "Add other incident type",
          userCreatedRowLabel: "Other incident type:",
          errorMessage: "Not compliant.",
          columns: [
            {
              id: "ima-description",
              label: "Incident type",
              type: "description",
            },
            { id: "ima-radio-yes", label: "Yes", type: "answer" },
            {
              id: "ima-radio-no",
              label: "No",
              type: "answer",
              nonCompliant: true,
            },
            { id: "ima-delete", label: "Delete", type: "delete" },
          ],
          rows: CRITICAL_INCIDENT_TYPES,
        },
        {
          type: ElementType.Divider,
          id: "divider",
          showWhenNonCompliant: ["critical-incident-definitions-table"],
        },
        {
          type: ElementType.ComplianceAlert,
          id: "compliance-alert",
          status: AlertTypes.WARNING,
          title: "This incident management system appears to be non-compliant.",
          text: "To be found in compliance, all HCBS programs under this IM system must define critical incidents to include all incident types listed above. If your system does not meet this requirement, please use the fields below to provide further detail.",
          controllerElementId: ["critical-incident-definitions-table"],
        },
        {
          type: ElementType.TextAreaField,
          id: "noncompliance-justification",
          label: "Justification for system noncompliance:",
          showWhenNonCompliant: ["critical-incident-definitions-table"],
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "timeline-justification",
          label:
            "What actions will the state take to fully demonstrate compliance? Include a timeline for these actions.",
          showWhenNonCompliant: ["critical-incident-definitions-table"],
          required: true,
        },
      ],
    },
    {
      id: "electronic-info-system",
      navTitle: "Electronic Information Systems",
      tabTitle: "Electronic Information Systems - IMA - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "electronic-info-header",
          text: "Electronic information systems",
        },
        {
          type: ElementType.Paragraph,
          id: "info-systems-definition",
          text: '"Information systems" are defined as an interconnected set of information resources under the same direct management control that shares common functionality. A system normally includes hardware, software, information, data, applications, communications, and people. (Cited in 45 CFR § 164.304)',
        },
        {
          type: ElementType.Radio,
          id: "info-systems-question-1",
          label:
            'Does this IM system use an "information system" that matches that definition?',
          required: true,
          choices: [
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  type: ElementType.Radio,
                  id: "question1-yes-radio",
                  label:
                    'Does this IM system comply with the security and privacy provisions described in <a href="https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C" class="parsed-html-link">45 CFR part 164</a>?',
                  required: true,
                  choices: [
                    {
                      label: "Yes",
                      value: "yes",
                    },
                    {
                      label: "No",
                      value: "no",
                    },
                  ],
                },
              ],
            },
            {
              label: "No",
              value: "no",
            },
          ],
        },
        {
          id: "info-systems-question-2",
          type: ElementType.Radio,
          label:
            "Has the state submitted an Advanced Planning Document (APD) for this IM system?",
          required: true,
          choices: [
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  type: ElementType.DateRange,
                  id: "question2-yes-date-range",
                  labels: {
                    top: "When did the state submit the APD?",
                    start: "Start date",
                    end: "End date",
                  },
                  dateFormat: "MMDDYYYY",
                  answer: {
                    start: "",
                  },
                  required: true,
                  endDateRequired: true,
                },
              ],
            },
            {
              label: "No",
              value: "no",
            },
          ],
        },
        {
          type: ElementType.ImaTable,
          id: "eletronic-incident-systems-table",
          caption: "Electronic Incident Systems Table",
          label:
            "Does this IM system enable the state to do each of the following?",
          errorMessage: "Not compliant.",
          columns: [
            {
              id: "eis-description",
              label: "Actions",
              type: "description",
            },
            { id: "eis-radio-yes", label: "Yes", type: "answer" },
            {
              id: "eis-radio-no",
              label: "No",
              type: "answer",
              nonCompliant: true,
            },
            { id: "eis-delete", label: "Delete", type: "delete" },
          ],
          rows: [
            {
              id: "collect-data",
              description: "Collect electronic critical incident data",
            },
            {
              id: "track-data",
              description:
                "Track that data, including the status and resolution of investigations",
            },
            {
              id: "identify-trends-in-data",
              description: "Identify trends in that data",
            },
          ],
        },
        {
          type: ElementType.Divider,
          id: "divider",
          showWhenNonCompliant: ["eletronic-incident-systems-table"],
        },
        {
          type: ElementType.ComplianceAlert,
          id: "compliance-alert",
          status: AlertTypes.WARNING,
          title: "This incident management system appears to be non-compliant.",
          text: "To be found in compliance, all HCBS programs under this IM system must define critical incidents to include all incident types listed above. If your system does not meet this requirement, please use the fields below to provide further detail.",
          controllerElementId: ["eletronic-incident-systems-table"],
        },
        {
          type: ElementType.TextAreaField,
          id: "noncompliance-justification",
          label: "Justification for system noncompliance:",
          showWhenNonCompliant: ["eletronic-incident-systems-table"],
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "timeline-justification",
          label:
            "What actions will the state take to fully demonstrate compliance? Include a timeline for these actions.",
          showWhenNonCompliant: ["eletronic-incident-systems-table"],
          required: true,
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
