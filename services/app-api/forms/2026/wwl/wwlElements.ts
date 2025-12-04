import {
  ElementType,
  RadioTemplate,
  TextAreaBoxTemplate,
} from "../../../types/reports";

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
