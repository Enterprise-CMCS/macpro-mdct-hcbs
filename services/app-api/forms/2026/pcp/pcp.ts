import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
} from "../../../types/reports";
import {
  additionalNotesField,
  didYouFollowSpecifications,
  divider,
  stateSamplingMethologyQuestion,
} from "../elements";

export const pcpReportTemplate: ReportBase = {
  type: ReportType.PCP,
  year: 2026,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "pcp-2", "review-submit"],
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
          type: ElementType.Radio,
          id: "programs-radio",
          label:
            "Does this report cover all the programs that are required under the relevant authorities?",
          choices: [
            { label: "Yes", value: "yes" },
            {
              label: "No",
              value: "no",
              checkedChildren: [
                {
                  type: ElementType.TextAreaField,
                  id: "included-waivers-programs",
                  label: "Which programs and waivers are included?",
                  required: true,
                  helperText:
                    "Please specify all the 1915(c) waivers, 1915(i), 1915(j), and 1915(k) State plan benefits, as well as any 1115 demonstrations that include HCBS, that you are including in this report. Include the program name and control numbers in your response.",
                },
              ],
            },
          ],
          required: true,
        },
      ],
    },
    {
      id: "pcp-2",
      title: "HCBS PCP-2",
      type: PageType.Standard,
      sidebar: true,
      hideNavButtons: false,
      elements: [
        {
          type: ElementType.Header,
          id: "pcp-2-header",
          text: "HCBS PCP-2: Beneficiaries for Whom the Person-Centered Service Plan Was Reviewed, and Updated as Appropriate, as a Result of a Reassessment of Functional Need",
        },
        {
          type: ElementType.NdrBasic,
          id: "pcp-2-rate",
          required: true,
          hintText: {
            numHint:
              "Number of beneficiaries who had their person-centered service plan reviewed, and updated as appropriate, based upon a reassessment of functional need, within the measurement period, across all applicable HCBS programs.",
            denomHint:
              "Number of beneficiaries who were due for an annual reassessment within the measurement period, across all applicable HCBS programs.",
            rateHint:
              "Auto-calculates. Percentage of beneficiaries continuously enrolled for at least 365 days in an applicable HCBS program who had their person-centered service plan reviewed, and updated as appropriate, based on a reassessment of functional need at least once within the measurement period, across all applicable HCBS programs.",
          },
          multiplier: 100,
          displayRateAsPercent: true,
          minPerformanceLevel: 90,
        },
        {
          type: ElementType.MeasureGroup,
          id: "group",
          parent: { id: "pcp-2-rate", type: ElementType.NdrBasic },
          elements: [
            {
              type: ElementType.TextAreaField,
              id: "pcp-2-explain-field",
              helperText:
                "Briefly explain why the minimum performance level was not achieved. If you believe this message was received in error, or if you plan to provide remediation plans outside of the system, note that here as well.",
              label:
                "Explain reason for not meeting Minimum Performance Level.",
              required: true,
            },
          ],
        },
        divider,
        {
          type: ElementType.SubHeader,
          id: "state-sampling-methodology-subheader",
          text: "State sampling methodology",
        },
        stateSamplingMethologyQuestion,
        divider,
        {
          type: ElementType.SubHeader,
          id: "additional-details-subheader",
          text: "Additional Details",
        },
        didYouFollowSpecifications,
        additionalNotesField,
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
          text: "Some sections of the PCP Report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
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
          text: 'Double check that everything in your PCP Report is accurate.  While it is in the "Submitted" status, you will only be able to make edits if you contact your CMS HCBS Lead to unlock your report.',
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
      ],
    },
  ],
};
