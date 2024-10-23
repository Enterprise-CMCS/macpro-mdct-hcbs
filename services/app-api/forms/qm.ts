import {
  ReportTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
} from "../types/reports";

export const qmReportTemplate: ReportTemplate = {
  type: ReportType.QM,
  title: "plan id",
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "req-measure-result",
        "strat-measure-result",
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
      sidebar: true,
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
          type: ElementType.MeasureTable,
          measureDisplay: "required",
        },
      ],
    },
    {
      id: "req-measure-result-modal",
      title: "Select measure",
      sidebar: true,
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
      id: "strat-measure-result",
      title: "Stratified Measure Results",
      type: PageType.Standard,
      sidebar: true,
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
          type: ElementType.MeasureTable,
          measureDisplay: "stratified",
        },
      ],
    },
    {
      id: "review-submit",
      title: "Review & Submit",
      type: PageType.Standard,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Review & Submit",
        },
        {
          type: ElementType.SubHeader,
          text: "Ready to Submit?",
        },
        {
          type: ElementType.Paragraph,
          text: "Double check that everything in your QMS Report is accurate. You will be able to make edits after submitting if you contact your [CMS representative] to unlock your report while it is in “Submitted” status.",
        },
        {
          type: ElementType.SubHeader,
          text: "Compliance review",
        },
        {
          type: ElementType.Paragraph,
          text: "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
        {
          type: ElementType.StatusTable,
          to: "review-submit",
        },
      ],
    },
  ],
  measureLookup: {
    defaultMeasures: [
      {
        cmit: 123,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName.StandardMeasure,
      },
      {
        cmit: 234,
        required: false,
        stratified: true,
        measureTemplate: MeasureTemplateName.StandardMeasure,
      },
    ],
    optionGroups: {
      rulesOne: [
        {
          cmit: 888,
          required: true,
          stratified: false,
          measureTemplate: MeasureTemplateName.StandardMeasure,
        },
      ],
      rulesTwo: [
        {
          cmit: 999,
          required: true,
          stratified: false,
          measureTemplate: MeasureTemplateName.StandardMeasure,
        },
      ],
    },
  },
  measureTemplates: {
    [MeasureTemplateName.StandardMeasure]: {
      id: "req-measure-report",
      title: "Example Measure",
      type: PageType.Measure,
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
  },
};
