import { ReportTemplate, ReportType, PageType, ElementType } from "../types";

export const hcbsReportTemplate: ReportTemplate = {
  type: ReportType.HCBS,
  title: "plan id",
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "req-measure-result",
        "strat-measure-report",
      ],
    },
    {
      id: "general-info",
      title: "General Information",
      type: PageType.Standard,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.SubHeader,
          text: "State of Program Information",
        },
        {
          type: ElementType.Textbox,
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
        {
          type: ElementType.Date,
          label: "Reporting period start date",
          helperText:
            "What is the reporting period Start Date applicable to the measure results?",
        },
        {
          type: ElementType.Date,
          label: "Reporting period end date",
          helperText:
            "What is the reporting period End Date applicable to the measure results?",
        },
      ],
    },
    {
      id: "req-measure-result",
      title: "Required Measure Results",
      type: PageType.Standard,
      elements: [
        {
          type: ElementType.Header,
          text: "Required Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.ResultRowButton,
          value: "{measure}",
          modalId: "req-measure-result-modal",
          to: "req-measure-report",
        },
      ],
      childPageIds: ["req-measure-report"],
    },
    {
      id: "req-measure-result-modal",
      title: "Select measure",
      type: PageType.Modal,
      elements: [
        {
          type: ElementType.Header,
          text: "Select measure",
        },
        {
          type: ElementType.Paragraph,
          text: "Select the correct version of the quality measure.",
        },
        {
          type: ElementType.Radio,
          label: "Which quality measure will be reported?",
          value: [
            { label: "{Measure name version 1}", value: "measure-1" },
            { label: "{Measure name version 2}", value: "measure-2" },
          ],
        },
      ],
    },
    {
      id: "req-measure-report",
      title: "Return to Required Measures Results Dashboard",
      type: PageType.Standard,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Required Measures Results Dashboard",
          to: "req-measure-result",
        },
        {
          type: ElementType.Header,
          text: "{measureName}",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value:
            "[Optional instructional content that could support the user in completing this page]",
        },
        {
          type: ElementType.SubHeader,
          text: "Measure Information",
        },
        {
          type: ElementType.Textbox,
          label:
            "What is the state performance target for this measure established by the state?",
        },
        {
          type: ElementType.Radio,
          label: "Is the performance target approved by CMS?",
          value: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
            { label: "In process", value: "inProcess" },
          ],
        },
      ],
    },
    {
      id: "strat-measure-report",
      title: "Stratified Measure Results",
      type: PageType.Standard,
      elements: [
        {
          type: ElementType.Header,
          text: "Stratified Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.ResultRowButton,
          value: "{measure}",
          modalId: "req-measure-result-modal",
          to: "req-measure-report",
        },
      ],
      childPageIds: ["req-measure-report"],
    },
  ],
};
