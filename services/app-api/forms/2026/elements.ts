import {
  ButtonLinkTemplate,
  DividerTemplate,
  ElementType,
  RadioTemplate,
  TextAreaBoxTemplate,
  CheckboxTemplate,
  PageElement,
  ListInputTemplate,
} from "../../types/reports";

// Any elements that are reused across multiple reports are added here

export const exportToPDF: ButtonLinkTemplate = {
  type: ElementType.ButtonLink,
  id: "pdf-btn",
  label: "Download PDF",
  to: "export",
  style: "pdf",
};

export const divider: DividerTemplate = {
  type: ElementType.Divider,
  id: "divider",
};

export const didYouFollowSpecifications: RadioTemplate = {
  type: ElementType.Radio,
  label: `Did you follow, with no variance, the most current technical specifications?`,
  id: "measure-following-tech-specs",
  choices: [
    { label: "Yes", value: "yes" },
    {
      label: "No",
      value: "no",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "measure-following-tech-specs-no-explain",
          label: "Explain the variance.",
          required: true,
          helperText:
            "Include the name of which technical specifications were used in the reporting of this measure, or any data elements that were collected outside of the most current guidance (e.g. sampling size, population, denomination calculation etc.)",
        },
      ],
    },
  ],
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
  required: true,
};

export const additionalNotesField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "additional-notes-field",
  helperText:
    "If applicable, add any notes or comments to provide context to the reported measure result",
  label: "Additional notes/comments",
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
  required: false,
};

export const minPerformanceExplanationField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "why-not-minimum",
  helperText:
    "The data entered indicates this measure does not meet the 90% Minimum Performance Level.",
  label: "Explain reason for not meeting Minimum Performance Level.",
  required: true,
};

// State Sampling Methodology Radio Question
export const stateSamplingMethologyQuestion: RadioTemplate = {
  type: ElementType.Radio,
  id: "state-sampling-methodology-question",
  required: true,
  label: "What sampling methodology was used?",
  choices: [
    { label: "Entire population", value: "Entire population" },
    {
      label: "Probability sample",
      value: "Probability sample",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "sampling-approach-used",
          label: "Describe the sampling approach used",
          required: true,
        },
        {
          type: ElementType.NumberField,
          id: "total-eligible-population",
          label: "Total eligible population",
          required: true,
        },
        {
          type: ElementType.NumberField,
          id: "sample-size",
          label: "Sample size",
          required: true,
        },
        {
          type: ElementType.TextAreaField,
          id: "sampling-process-used",
          label:
            "Describe the process used to pull a simple random sample of the eligible population",
          required: true,
        },
      ],
    },
    {
      label: "Other",
      value: "Other",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "sampling-approach-used",
          label:
            "Please provide a detailed description of the alternative sampling methodology. If this measure aggregates results from multiple programs that used different methodologies, specify which method was used for each program and how the results were combined.",
          required: true,
        },
      ],
    },
  ],
};

export const waiverListCheckboxField: CheckboxTemplate = {
  type: ElementType.Checkbox,
  id: "waivers-list-checkboxes",
  label:
    "Select all programs and waivers that are included in this reporting period?",
  choices: [
    /* Generated in buildReport, with data from waivers.ts */
  ],
  helperText: "Select all that apply.",
  required: false,
};

export const whichProgramsWaivers: PageElement[] = [
  waiverListCheckboxField,
  divider,
];

export const waiverListInputField: ListInputTemplate = {
  type: ElementType.ListInput,
  id: "waivers-list-inputs",
  label: "If a waiver or demonstration is not included above, add below:",
  helperText:
    "Include the waiver/demonstration name and control numbers in your response.",
  fieldLabel: "Waiver/demonstration and/or control numbers",
  buttonText: "Add waiver/demonstration name",
  required: false,
};
