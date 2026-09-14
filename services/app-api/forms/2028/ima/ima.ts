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
import {
  DATA_SOURCE_COLUMNS,
  INCIDENT_REPORTING_COLUMNS,
  UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_DURING,
  UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_FAILURE,
} from "./incidentsDuringAndFailureTables";

export const imaReportTemplate: ReportBase = {
  type: ReportType.IMA,
  year: 2028,
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "critical-incident-definitions",
        "incidents-during-delivery-of-services",
        "incidents-due-to-failure-to-deliver-services",
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
      id: "incidents-during-delivery-of-services",
      navTitle: "Incidents During Delivery of Services",
      tabTitle: "Incidents During Delivery of Services - IMA - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "incidents-during-delivery-header",
          text: "Incidents during delivery of services",
        },
        {
          type: ElementType.ImaTable,
          id: "incidents-during-delivery-provider-reporting-table",
          caption:
            "Incidents During Delivery of Services Provider Reporting Table",
          label:
            "For each of the following incident types: Do all HCBS programs under this IM system require providers to report critical incidents occurring during service delivery, as specified in person-centered plans, within State-specified timeframes and procedures?",
          helperText:
            "If some programs include the incident type but others do not, select “No.”",
          errorMessage: "Not compliant.",
          columns: INCIDENT_REPORTING_COLUMNS,
          rows: CRITICAL_INCIDENT_TYPES,
        },
        {
          type: ElementType.ImaTable,
          id: "incidents-during-delivery-unreported-data-sources-table",
          caption:
            "Incidents During Delivery of Services Unreported Critical Incident Data Sources Table",
          label:
            "To the extent permissible, does the state use the following data sources to identify critical incidents that are unreported by providers and occur during the delivery of services?",
          addButtonText: "Add data source",
          userCreatedRowLabel: "Data source:",
          errorMessage: "Not compliant.",
          allowUserCreatedRows: true,
          columns: DATA_SOURCE_COLUMNS,
          rows: UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_DURING,
        },
        {
          type: ElementType.Divider,
          id: "incidents-during-delivery-divider",
          showWhenNonCompliant: [
            "incidents-during-delivery-provider-reporting-table",
            "incidents-during-delivery-unreported-data-sources-table",
          ],
        },
        {
          type: ElementType.ComplianceAlert,
          id: "incidents-during-delivery-compliance-alert",
          status: AlertTypes.WARNING,
          title: "This incident management system appears to be non-compliant.",
          text: "To be found in compliance, all HCBS programs under this IM system must require providers to report all critical incident types, and the state must utilize permissible required data sources (Claims data, MFCU, APS, CPS) to identify unreported incidents. If your system does not meet these requirements, please use the fields below to provide further detail.",
          controllerElementId: [
            "incidents-during-delivery-provider-reporting-table",
            "incidents-during-delivery-unreported-data-sources-table",
          ],
        },
        {
          type: ElementType.TextAreaField,
          id: "incidents-during-delivery-noncompliance-justification",
          label: "Justification for system noncompliance",
          showWhenNonCompliant: [
            "incidents-during-delivery-provider-reporting-table",
            "incidents-during-delivery-unreported-data-sources-table",
          ],
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "incidents-during-delivery-timeline-justification",
          label:
            "What actions will the state take to fully demonstrate compliance? Include a timeline for these actions.",
          showWhenNonCompliant: [
            "incidents-during-delivery-provider-reporting-table",
            "incidents-during-delivery-unreported-data-sources-table",
          ],
          required: true,
        },
      ],
    },
    {
      id: "incidents-due-to-failure-to-deliver-services",
      navTitle: "Incidents Due to Failure to Deliver Services",
      tabTitle: "Incidents Due to Failure to Deliver Services - IMA - HCBS",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "incidents-failure-to-deliver-header",
          text: "Incidents due to failure to deliver services",
        },
        {
          type: ElementType.ImaTable,
          id: "incidents-failure-to-deliver-provider-reporting-table",
          caption:
            "Incidents Due to Failure to Deliver Services Provider Reporting Table",
          label:
            "For each of the following incident types: Do all HCBS programs under this IM system require providers to report critical incidents occurring due to failure to deliver services, as specified in person-centered plans, within State-specified timeframes and procedures?",
          helperText:
            "If some programs include the incident type but others do not, select “No.”",
          errorMessage: "Not compliant.",
          columns: INCIDENT_REPORTING_COLUMNS,
          rows: CRITICAL_INCIDENT_TYPES,
        },
        {
          type: ElementType.ImaTable,
          id: "incidents-failure-to-deliver-unreported-data-sources-table",
          caption:
            "Incidents Due to Failure to Deliver Services Unreported Critical Incident Data Sources Table",
          label:
            "To the extent permissible, does the state use the following data sources to identify critical incidents that are unreported by providers and occur due to the failure to deliver services?",
          addButtonText: "Add other agency",
          userCreatedRowLabel: "Other agency:",
          errorMessage: "Not compliant.",
          allowUserCreatedRows: true,
          columns: DATA_SOURCE_COLUMNS,
          rows: UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_FAILURE,
        },
        {
          type: ElementType.Divider,
          id: "incidents-failure-to-deliver-divider",
          showWhenNonCompliant: [
            "incidents-failure-to-deliver-provider-reporting-table",
            "incidents-failure-to-deliver-unreported-data-sources-table",
          ],
        },
        {
          type: ElementType.ComplianceAlert,
          id: "incidents-failure-to-deliver-compliance-alert",
          status: AlertTypes.WARNING,
          title: "This incident management system appears to be non-compliant.",
          text: "To be found in compliance, all HCBS programs under this IM system must require providers to report all critical incident types, and the state must utilize permissible required data sources (Claims data, MFCU, APS, CPS) to identify unreported incidents. If your system does not meet these requirements, please use the fields below to provide further detail.",
          controllerElementId: [
            "incidents-failure-to-deliver-provider-reporting-table",
            "incidents-failure-to-deliver-unreported-data-sources-table",
          ],
        },
        {
          type: ElementType.TextAreaField,
          id: "incidents-failure-to-deliver-noncompliance-justification",
          label: "Justification for system noncompliance",
          showWhenNonCompliant: [
            "incidents-failure-to-deliver-provider-reporting-table",
            "incidents-failure-to-deliver-unreported-data-sources-table",
          ],
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "incidents-failure-to-deliver-timeline-justification",
          label:
            "What actions will the state take to fully demonstrate compliance? Include a timeline for these actions.",
          showWhenNonCompliant: [
            "incidents-failure-to-deliver-provider-reporting-table",
            "incidents-failure-to-deliver-unreported-data-sources-table",
          ],
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
