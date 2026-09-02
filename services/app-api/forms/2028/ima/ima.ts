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

export const imaReportTemplate: ReportBase = {
  type: ReportType.IMA,
  year: 2028,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "electronic-info-system", "review-submit"],
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
          text: '"Information systems" are defined a an interconnected set of information resources under the same direct management control that shares common functionality.  A system normally includes hardware, software, information, data, applications, communications, and people. (Cited in 45 CFR § 164.304)',
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
