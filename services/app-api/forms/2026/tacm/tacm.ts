import {
  PageType,
  ElementType,
  ReportType,
  HeaderIcon,
  ReportBase,
  AlertTypes,
} from "../../../types/reports";
import {
  additionalNotesField,
  divider,
  stateSamplingMethologyQuestion,
  didYouFollowSpecifications,
  exportToPDF,
} from "../elements";
import {
  conversionOfServiceUnitsField,
  homemakerRate,
  homemakerHAPCH2Rate,
  homeHealthAideRate,
  homeHealthAideHAPCH2Rate,
  personalCareRate,
  personalCareHAPCH2Rate,
  habilitationRate,
  habilitationHAPCH2Rate,
} from "./tacmElements";

export const tacmReportTemplate: ReportBase = {
  type: ReportType.TACM,
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
        {
          type: ElementType.Radio,
          id: "report-coverage-waivers-programs",
          label:
            "Does this report cover all the programs that are required under the relevant authorities?",
          required: true,
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
          text: "HCBS HAPCH-1: Time from Initial Approval of Homemaker, Home Health Aide, Personal Care, and Habilitation Services to When Services Began",
        },
        {
          type: ElementType.Accordion,
          id: "hapch-1-instructions",
          label: "Instructions",
          value:
            "<b>Sampling methodologies</b>" +
            "<p>States have the choice of two sampling methodologies when reporting on HAPCH-1: Entire population or probability sample. If the probability sample is chosen, the state is required describe the:</p>" +
            "<ul>" +
            "  <li>Sampling approach used</li>" +
            "  <li>Total eligible population</li>" +
            "  <li>Sample size</li>" +
            "  <li>Process used to pull a simple random sample of the eligible population.</li>" +
            "</ul>",
        },
        homemakerRate,
        divider,
        homeHealthAideRate,
        divider,
        personalCareRate,
        divider,
        habilitationRate,
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
          value:
            "<b>Sampling methodologies</b>" +
            "<p>States have the choice of two sampling methodologies when reporting on HAPCH-1: Entire population or probability sample. If the probability sample is chosen, the state is required describe the:</p>" +
            "<ul>" +
            "  <li>Sampling approach used</li>" +
            "  <li>Total eligible population</li>" +
            "  <li>Sample size</li>" +
            "  <li>Process used to pull a simple random sample of the eligible population.</li>" +
            "</ul>",
        },
        homemakerHAPCH2Rate,
        divider,
        homeHealthAideHAPCH2Rate,
        divider,
        personalCareHAPCH2Rate,
        divider,
        habilitationHAPCH2Rate,
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
        conversionOfServiceUnitsField,
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
          status: AlertTypes.ERROR,
          title: "Your form is not ready for submission",
          text: "Some sections of the TACM Report have errors or are missing required responses. Ensure all required fields are completed with valid responses before submitting.",
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
          text: 'Double check that everything in your TACM Report is accurate. You will be able to make edits after submitting if you contact your CMS HCBS Lead to unlock your report while it is in "Submitted" status.',
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
          text: "Email your CMS representative to inform them you submitted the TACM Report and it is ready for their review.",
        },
        exportToPDF,
      ],
    },
  ],
};
