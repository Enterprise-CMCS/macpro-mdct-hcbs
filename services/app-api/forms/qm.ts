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
      {
        cmit: 960,
        required: true,
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
          label: "Return to Required Measures Dashboard",
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
          text: "Measure Details",
        },
        {
          type: ElementType.Radio,
          label: "Were the reported measure results audited or validated?",
          value: [
            {
              label: "Yes, CMS is reporting on my behalf",
              value: "yes",
              checkedChildren: [
                {
                  type: ElementType.Textbox,
                  label:
                    "What is the name of the agency of entity that audited or validated the report?",
                },
              ],
            },
            { label: "No, I am reporting on this measure", value: "no" },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "What Technical Specifications are you using to report this measure?",
          value: [
            { label: "CMS", value: "cms" },
            { label: "HEDIS", value: "hedis" },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "Did you deviate from the [reportYear] Technical Specifications?",
          value: [
            {
              label: "Yes",
              value: "yes",
              checkedChildren: [
                {
                  type: ElementType.Textbox,
                  label: "Please explain the deviation.",
                },
              ],
            },
            { label: "No", value: "no" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report the LTSS measure?",
          value: [
            { label: "Managed Care", value: "managed-care" },
            { label: "Free-For-Service", value: "fee-for-service" },
            { label: "Both", value: "both" },
          ],
        },
        {
          type: ElementType.SubHeader,
          text: "Quality Measures",
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName.QualityMeasure]: {
      id: "req-measure-result-report",
      title: "Example Measure Result",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Required Measures Results Dashboard",
          to: "req-measure-report",
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
            "What is the [two years in the future] state performance target for this measure established by the state?",
        },
        {
          type: ElementType.Radio,
          label:
            "Did the calculation of the measure results device from the measure technical specification?",
          value: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Were the reported measure results audited or validated?",
          value: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          type: ElementType.Textbox,
          label: "Additional notes/comments",
          helperText:
            "If applicable, add any notes or comments to provide context to the reported measure results.",
        },
        {
          type: ElementType.SubHeader,
          text: "Measure Results",
        },
        {
          type: ElementType.Paragraph,
          title: "Overall Measure results",
          text: "What are the overall results for this measure? To calculate the aggregate based on population weight, please use this template.",
        },
        {
          type: ElementType.Textbox,
          label: "Numerator",
        },
        {
          type: ElementType.Textbox,
          label: "Denominator",
        },
        {
          type: ElementType.Textbox,
          helperText: "Auto-calculates",
          label: "Rate",
        },
        {
          type: ElementType.SubHeader,
          text: "Measure Stratification",
        },
        {
          type: ElementType.Paragraph,
          text: "If the stratification factor applies to this measure, select it and enter the stratified measure results specific to the demographic group. Do not select categories and sub-classifications for which you will not be reporting any data",
        },
        {
          type: ElementType.Radio,
          label: "Are you reporting measure stratification for this measure?",
          value: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
      ],
    },
  },
};
