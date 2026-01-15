import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
  AlertTypes,
} from "../../../types/reports";
import { exportToPDF } from "../elements";
import {
  wwlFinancialEligiblityExplanationField,
  wwlRescreenForFinancialEligibilityField,
  wwlUpdateInfoForFinancialEligibilityField,
  wwlFunctionalEligiblityExplanationField,
  wwlRescreenForFunctionalEligibilityField,
  wwlUpdateInfoForFunctionalEligibilityField,
  wwlAddOtherEligibilityTableElement,
} from "./wwlElements";

export const wwlReportTemplate: ReportBase = {
  type: ReportType.WWL,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "waiting-list-identifiers",
        "financial-eligibility",
        "functional-eligibility",
        "add-other-eligibility",
        "waiting-list-limits",
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
        {
          type: ElementType.NumberField,
          id: "number-of-individuals",
          label: "Number of individuals included on the waiting list",
          required: true,
          helperText:
            "Enter the total number of individuals on the waiting list. Use whole numbers only. Include all individuals who were enrolled at any point during the measurement period.",
        },
      ],
    },
    {
      id: "waiting-list-identifiers",
      title: "Waiting List Identifiers",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "waiting-list-identifiers-header",
          text: "Waiting List Identifiers",
        },
      ],
    },
    {
      id: "financial-eligibility",
      title: "Financial Eligibility",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "financial-eligibility-header",
          text: "Financial Eligibility",
        },
        {
          id: "financial-eligibility-confirmation",
          type: ElementType.Radio,
          label:
            "Does the state confirm whether someone meets financial eligibility before they’re added to the waiting list?",
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
        wwlFinancialEligiblityExplanationField,
        wwlRescreenForFinancialEligibilityField,
        wwlUpdateInfoForFinancialEligibilityField,
      ],
    },
    {
      id: "functional-eligibility",
      title: "Functional Eligibility",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "functional-eligibility-header",
          text: "Functional Eligibility",
        },
        {
          id: "functional-eligibility-confirmation",
          type: ElementType.Radio,
          label:
            "Does the state confirm whether someone meets functional eligibility before they’re added to the waiting list?",
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
        wwlFunctionalEligiblityExplanationField,
        wwlRescreenForFunctionalEligibilityField,
        wwlUpdateInfoForFunctionalEligibilityField,
      ],
    },
    {
      id: "add-other-eligibility",
      title: "Other Eligibility",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "add-other-eligibility-header",
          text: "Other Eligibility",
        },
        {
          type: ElementType.Paragraph,
          id: "add-other-eligibility-instructions",
          text: "If the state screens individuals for other eligibility requirements before placing them on the waiting list, add those eligibility requirements here.",
        },
        wwlAddOtherEligibilityTableElement,
      ],
    },
    {
      id: "waiting-list-limits",
      title: "Waiting List Limits",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "waiting-list-limits-header",
          text: "Waiting List Limits",
        },
        {
          id: "waiting-list-limits-confirmation",
          type: ElementType.Radio,
          label:
            "Does the state limit the number of individuals who can be on the waiting list or limit the waiting list to individuals who meet certain criteria?",
          required: true,
          choices: [
            {
              label: "No",
              value: "no",
            },
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  type: ElementType.TextAreaField,
                  id: "waiting-list-limits-explanation",
                  label:
                    "Describe how the state limits the number of individuals on the waiting list (including the amount of the limit) or limits the waiting list to individuals who meet certain criteria (including the specific criteria used for the limit).",
                  required: true,
                },
              ],
            },
          ],
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
          text: "Some sections of the WWL Report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
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
          text: 'Double check that everything in your WWL Report is accurate.  While it is in the "Submitted" status, you will only be able to make edits if you contact your CMS HCBS Lead to unlock your report.',
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
          text: 'Your dashboard will indicate the status of this report as "Submitted" and and it is now locked from editing.',
        },
        {
          type: ElementType.Paragraph,
          weight: "bold",
          id: "submitted-what-happens",
          text: "Email your CMS HCBS Lead to inform them you submitted the Person-Centered Planning Report and it is ready for their review.",
        },
        exportToPDF,
      ],
    },
  ],
};
