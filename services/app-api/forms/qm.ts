import {
  ReportTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
  ButtonLinkTemplate,
  HeaderTemplate,
  AccordionTemplate,
  SubHeaderTemplate,
  TextboxTemplate,
  RadioTemplate,
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
          type: ElementType.Paragraph,
          title: "Ready to Submit?",
          text: "Double check that everything in your QMS Report is accurate. You will be able to make edits after submitting if you contact your [CMS representative] to unlock your report while it is in “Submitted” status.",
        },
        {
          type: ElementType.Paragraph,
          title: "Compliance review",
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
    // TODO: wtf is default and are there any other kinds of measures?
    defaultMeasures: [
      {
        cmit: 960,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-1"],
      },
      {
        cmit: 961,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-2"],
      },
      {
        cmit: 20,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-6"],
      },
      {
        cmit: 968,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-7"],
      },
      {
        cmit: 414,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-8"],
      },
      {
        cmit: 234,
        required: false,
        stratified: false,
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
    [MeasureTemplateName["LTSS-1"]]: {
      id: "LTSS-1",
      title: "LTSS-1: Comprehensive Assessment and Update",
      type: PageType.Measure,
      substitutable: true,
      sidebar: false,
      elements: [],
    },
    [MeasureTemplateName["LTSS-2"]]: {
      id: "LTSS-2",
      title: "LTSS-2: Comprehensive Person-Centered Plan and Update",
      type: PageType.Measure,
      sidebar: false,
      substitutable: true,
      elements: [],
    },
    [MeasureTemplateName["LTSS-6"]]: {
      id: "LTSS-6",
      title: "LTSS-6: Admission to a Facility from the Community",
      type: PageType.Measure,
      sidebar: false,
      elements: [],
    },
    [MeasureTemplateName["LTSS-7"]]: {
      id: "LTSS-7",
      title: "LTSS-7: Minimizing Facility Length of Stay",
      type: PageType.Measure,
      sidebar: false,
      elements: [],
    },
    [MeasureTemplateName["LTSS-8"]]: {
      id: "LTSS-8",
      title: "LTSS-8: Successful Transition after Long-Term Facility Stay",
      type: PageType.Measure,
      sidebar: false,
      elements: [],
    },
  },
};
