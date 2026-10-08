import {
  CheckboxTemplate,
  DividerTemplate,
  ElementType,
  HideCondition,
  PageElement,
  PerformanceNdrTemplate,
  TextAreaBoxTemplate,
} from "../../../types/reports";
import {
  additionalNotesField,
  didYouFollowSpecifications,
  stateSamplingMethologyQuestion,
} from "../elements";

const serviceTypeChoices = [
  { label: "Homemaker", value: "homemaker" },
  { label: "Home Health Aide", value: "home-health-aide" },
  { label: "Personal Care", value: "personal-care" },
  { label: "Habilitation", value: "habilitation" },
];

export const serviceTypesCheckbox: CheckboxTemplate = {
  type: ElementType.Checkbox,
  id: "service-types-checkbox",
  label: "Which service types are included in this measure?",
  helperText: "Select all that apply.",
  choices: serviceTypeChoices,
  required: true,
  clickAction: "serviceTypeChange",
};

const showWhenSelected = (serviceTypes: string[]): HideCondition => ({
  controllerElementId: serviceTypesCheckbox.id,
  answerExcludes: serviceTypes,
});

const showWhenAnySelected = showWhenSelected(
  serviceTypeChoices.map((choice) => choice.value)
);

export const serviceTypesDivider: DividerTemplate = {
  type: ElementType.Divider,
  id: "service-types-divider",
  hideCondition: showWhenAnySelected,
};

export const serviceTypeSection = (
  serviceType: string,
  rate: PerformanceNdrTemplate
): PageElement[] => {
  const hideCondition = showWhenSelected([serviceType]);
  return [
    { ...rate, hideCondition },
    { type: ElementType.Divider, id: `${serviceType}-divider`, hideCondition },
  ];
};

const stateSamplingMethologyQuestionHAReport = (
  rateId: string
): NonNullable<PerformanceNdrTemplate["children"]> => [
  {
    type: ElementType.SubHeader,
    id: `${rateId}-state-sampling-methodology-subheader`,
    text: "State sampling methodology",
  },
  {
    ...stateSamplingMethologyQuestion,
    id: `${rateId}-${stateSamplingMethologyQuestion.id}`,
    choices: stateSamplingMethologyQuestion.choices.map((choice) => ({
      ...choice,
      checkedChildren: choice.checkedChildren?.map((child) => ({
        ...child,
        id: `${rateId}-${child.id}`,
      })),
    })),
  },
];

const withSamplingMethodology = (
  rate: PerformanceNdrTemplate
): PerformanceNdrTemplate => ({
  ...rate,
  children: stateSamplingMethologyQuestionHAReport(rate.id),
});

export const conversionOfServiceUnitsField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "conversion-of-service-units-field",
  helperText:
    "Brief explanation of the state's process to convert service units into hours.",
  label: "Conversion of service units into hours",
  required: true,
  hideCondition: showWhenAnySelected,
};

export const additionalDetailsSection = (
  extraFields: TextAreaBoxTemplate[] = []
): PageElement[] => [
  {
    type: ElementType.SubHeader,
    id: "additional-details-subheader",
    text: "Additional Details",
    hideCondition: showWhenAnySelected,
  },
  ...extraFields,
  { ...didYouFollowSpecifications, hideCondition: showWhenAnySelected },
  { ...additionalNotesField, hideCondition: showWhenAnySelected },
];

// Rates for Homemaker for HAPC-1 measure
export const homemakerRate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "homemaker-1-rate",
  required: true,
  label: "Homemaker",
  hintText: {
    numHint:
      "Number of days between initial approval and receipt of homemaker services for all beneficiaries who received services through an applicable HCBS program.",
    denomHint:
      "Number of beneficiaries in an applicable HCBS program who received homemaker services within the measurement period.",
    rateHint:
      "Auto-calculates. Average amount of time from when services were initially approved to when services began for individuals who received homemaker services within the measurement period across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Homemaker for HAPC-2 measure
export const homemakerHAPCH2Rate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "homemaker-2-rate",
  required: true,
  label: "Homemaker",
  hintText: {
    numHint:
      "Total number of hours for homemaker services that were provided to beneficiaries within the measurement period across all applicable HCBS programs.",
    denomHint:
      "Total number of hours for homemaker services that were authorized within the measurement period across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of authorized hours for homemaker services provided to individuals in an applicable HCBS program within the measurement period.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Home Health Aide or HAPCH-1 measure
export const homeHealthAideRate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "home-health-aide-1-rate",
  required: true,
  label: "Home Health Aide",
  hintText: {
    numHint:
      "Number of days between initial approval and receipt of home health aide services for all beneficiaries who received services through an applicable HCBS program.",
    denomHint:
      "Number of beneficiaries in an applicable HCBS program who received home health aide services within the measurement period.",
    rateHint:
      "Auto-calculates. Average amount of time from when services were initially approved to when services began for individuals who received home health aide services within the measurement period across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Home Health Aide for HAPCH-2 measure
export const homeHealthAideHAPCH2Rate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "home-health-aide-2-rate",
  required: true,
  label: "Home Health Aide",
  hintText: {
    numHint:
      "Total number of hours for home health aide services that were provided to beneficiaries within the measurement period across all applicable HCBS programs.",
    denomHint:
      "Total number of hours for home health aide services that were authorized within the measurement period across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of authorized hours for home health aide services provided to individuals in an applicable HCBS program within the measurement period.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Personal Care for HAPCH-1 measure
export const personalCareRate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "personal-care-1-rate",
  required: true,
  label: "Personal Care",
  hintText: {
    numHint:
      "Number of days between initial approval and receipt of personal care services for all beneficiaries who received services through an applicable HCBS program.",
    denomHint:
      "Number of beneficiaries in an applicable HCBS program who received personal care services within the measurement period.",
    rateHint:
      "Auto-calculates. Average amount of time from when services were initially approved to when services began for individuals who received personal care services within the measurement period across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Personal Care for HAPCH-2 measure
export const personalCareHAPCH2Rate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "personal-care-2-rate",
  required: true,
  label: "Personal Care",
  hintText: {
    numHint:
      "Total number of hours for personal care services that were provided to beneficiaries within the measurement period across all applicable HCBS programs.",
    denomHint:
      "Total number of hours for personal care services that were authorized within the measurement period across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of authorized hours for personal care services provided to individuals in an applicable HCBS program within the measurement period.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Habilitation for HAPCH-1 measure
export const habilitationRate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "habilitation-1-rate",
  required: true,
  label: "Habilitation",
  hintText: {
    numHint:
      "Number of days between initial approval and receipt of habilitation services for all beneficiaries who received services through an applicable HCBS program.",
    denomHint:
      "Number of beneficiaries in an applicable HCBS program who received habilitation services within the measurement period.",
    rateHint:
      "Auto-calculates. Average amount of time from when services were initially approved to when services began for individuals who received habilitation services within the measurement period across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});

// Rates for Habilitation for HAPCH-2 measure
export const habilitationHAPCH2Rate = withSamplingMethodology({
  type: ElementType.PerformanceNdr,
  id: "habilitation-2-rate",
  required: true,
  label: "Habilitation",
  hintText: {
    numHint:
      "Total number of hours for habilitation services that were provided to beneficiaries within the measurement period across all applicable HCBS programs.",
    denomHint:
      "Total number of hours for habilitation services that were authorized within the measurement period across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of authorized hours for habilitation services provided to individuals in an applicable HCBS program within the measurement period.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
});
