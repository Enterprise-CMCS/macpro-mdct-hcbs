import {
  ElementType,
  EligibilityTableTemplate,
  RadioTemplate,
  TextAreaBoxTemplate,
} from "../../../types/reports";

export const addOtherEligibilityTableVerbiage = {
  fieldLabels: {
    title:
      "What other eligibility requirement does your state use for this waiting list?",
    description:
      "Describe how the state checks for this eligibility before adding someone to the waiting list.",
    recheck:
      "Does the state periodically recheck individuals on the waiting list for this eligibility?",
    frequency:
      "How often does the state recheck individuals on the waiting list for this eligibility?",
    eligibilityUpdate:
      "Can individuals update or resubmit their information if their eligibility needs to be reviewed?",
  },
  modalInstructions:
    "If the state screens individuals for other eligibility requirements before placing them on the waiting list, add those eligibility requirements here.",
  frequencyOptions: [
    { label: "Less than annually", value: "Less than annually" },
    { label: "Annually", value: "Annually" },
    { label: "More than annually", value: "More than annually" },
  ],
};

export const wwlAddOtherEligibilityTableElement: EligibilityTableTemplate = {
  type: ElementType.EligibilityTable,
  id: "add-other-eligibility-table",
  ...addOtherEligibilityTableVerbiage,
};

export const wwlFinancialEligiblityExplanationField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "financial-eligibility-explanation",
  label:
    "Describe how the state checks for financial eligibility before adding someone to the waiting list.",
  required: true,
  hideCondition: {
    controllerElementId: "financial-eligibility-confirmation",
    answer: "no",
  },
};

export const wwlRescreenForFinancialEligibilityField: RadioTemplate = {
  type: ElementType.Radio,
  id: "rescreen-financial-eligibility-field",
  label:
    "Does the state periodically recheck individuals on the waiting list for financial eligibility?",
  choices: [
    {
      label: "Yes",
      value: "yes",
      checkedChildren: [
        {
          type: ElementType.Radio,
          id: "rescreen-financial-eligibility-child",
          label:
            "How often does the state recheck individuals on the waiting list for financial eligibility?	",
          choices: [
            { label: "Less than annually", value: "Less than annually" },
            { label: "Annually", value: "Annually" },
            { label: "More than annually", value: "More than annually" },
          ],
          required: true,
        },
      ],
    },
    {
      label: "No",
      value: "no",
    },
  ],
  required: true,
  hideCondition: {
    controllerElementId: "financial-eligibility-confirmation",
    answer: "no",
  },
};

export const wwlUpdateInfoForFinancialEligibilityField: RadioTemplate = {
  type: ElementType.Radio,
  id: "update-info-financial-eligibility-field",
  label:
    "Can individuals update or resubmit their information if their financial eligibility needs to be reviewed?",
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
  required: true,
  hideCondition: {
    controllerElementId: "financial-eligibility-confirmation",
    answer: "no",
  },
};

export const wwlFunctionalEligiblityExplanationField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "functional-eligibility-explanation",
  label:
    "Describe how the state checks for functional eligibility before adding someone to the waiting list.",
  required: true,
  hideCondition: {
    controllerElementId: "functional-eligibility-confirmation",
    answer: "no",
  },
};

export const wwlRescreenForFunctionalEligibilityField: RadioTemplate = {
  type: ElementType.Radio,
  id: "rescreen-functional-eligibility-field",
  label:
    "Does the state periodically recheck individuals on the waiting list for functional eligibility?",
  choices: [
    {
      label: "Yes",
      value: "yes",
      checkedChildren: [
        {
          type: ElementType.Radio,
          id: "rescreen-functional-eligibility-child",
          label:
            "How often does the state recheck individuals on the waiting list for functional eligibility?	",
          choices: [
            { label: "Less than annually", value: "Less than annually" },
            { label: "Annually", value: "Annually" },
            { label: "More than annually", value: "More than annually" },
          ],
          required: true,
        },
      ],
    },
    {
      label: "No",
      value: "no",
    },
  ],
  required: true,
  hideCondition: {
    controllerElementId: "functional-eligibility-confirmation",
    answer: "no",
  },
};

export const wwlUpdateInfoForFunctionalEligibilityField: RadioTemplate = {
  type: ElementType.Radio,
  id: "update-info-functional-eligibility-field",
  label:
    "Can individuals update or resubmit their information if their functional eligibility needs to be reviewed?",
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
  required: true,
  hideCondition: {
    controllerElementId: "functional-eligibility-confirmation",
    answer: "no",
  },
};
