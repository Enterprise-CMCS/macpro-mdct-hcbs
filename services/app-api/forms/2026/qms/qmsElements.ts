import {
  AccordionTemplate,
  AlertTypes,
  ButtonLinkTemplate,
  DateRangeTemplate,
  ElementType,
  HeaderTemplate,
  LengthOfStayRateTemplate,
  MeasureDetailsTemplate,
  MeasureFooterTemplate,
  MeasureResultsNavigationTableTemplate,
  MultiRateNdrTemplate,
  MultiCategoryNdrTemplate,
  NdrTemplate,
  PageElement,
  RadioTemplate,
  ReadmissionRateTemplate,
  StatusAlertTemplate,
  SubHeaderMeasureTemplate,
  SubHeaderTemplate,
} from "../../../types/reports";
import { divider } from "../elements";

export const returnToRequiredDashboard: ButtonLinkTemplate = {
  type: ElementType.ButtonLink,
  id: "return-button",
  label: "Return to Required Measures Dashboard",
  to: "req-measure-result",
};

export const returnToOptionalDashboard: ButtonLinkTemplate = {
  type: ElementType.ButtonLink,
  id: "return-button",
  label: "Return to Optional Measures Dashboard",
  to: "optional-measure-result",
};

export const returnToDashboard: ButtonLinkTemplate = {
  type: ElementType.ButtonLink,
  id: "return-button",
};

export const measureType: SubHeaderMeasureTemplate = {
  type: ElementType.SubHeaderMeasure,
  id: "measure-type",
};

export const measureHeader: HeaderTemplate = {
  type: ElementType.Header,
  id: "measure-header",
  text: "{measureName}",
};

export const measureInstructionsWithLink: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "measure-instructions-with-tech-spec-link",
  label: "Instructions",
  value:
    "<strong>Instructions for Completing this Measure</strong>" +
    "<p>Before you can click the <b>“Complete measure“</b> button, you must answer all required (non-optional) questions for the measure and any associated measure sections (such as delivery method or measure part).</p>" +
    "<p>Please review your responses to ensure all mandatory fields are filled out before proceeding.</p>" +
    "<p>The <b>“Clear measure data”</b> button can be used to reset the entire measure (including any completed sections). All data previously entered will be cleared and not submitted upon report completion.</p>" +
    '<a href="https://www.medicaid.gov/license/form/8586/3396" class="tech-spec-link" target="_blank">View Current Technical Specifications<img src="/icon_external_link_main.svg" class="tech-spec-icon" alt="(Opens in a new tab)"></a>',
};

export const measureInstructions: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "measure-instructions",
  label: "Instructions",
  value:
    "<strong>Instructions for Completing this Measure</strong>" +
    "<p>Before you can click the <b>“Complete measure”</b> button, you must answer all required (non-optional) questions for the measure and any associated measure sections (such as delivery method or measure part).</p>" +
    "<p>Please review your responses to ensure all mandatory fields are filled out before proceeding.</p>" +
    "<p>The <b>“Clear measure data”</b> button can be used to reset the entire measure (including any completed sections). All data previously entered will be cleared and not submitted upon report completion.</p>",
};

export const deliveryMethodMeasureInstructions: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "delivery-method-measure-instructions",
  label: "Instructions",
  value:
    "<b>Instructions for Completing this section</b>" +
    "<p>Before you can click the <b>“Complete section”</b> button, you must answer all required (non-optional) questions for the measure section.</p>" +
    "<p>Please review your responses to ensure all mandatory fields are filled out before proceeding.</p>" +
    "<p>Once complete, you can still edit this section but the status will change to “In progress” and you will need to re-select the “Complete section” button.</p>",
};

export const measureDetailsSection: MeasureDetailsTemplate = {
  type: ElementType.MeasureDetails,
  id: "measure-details-section",
};

export const measureInformationSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  id: "measure-information-subheader",
  text: "Measure Information",
};

export const feeForServiceMeasureResultsSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  id: "fee-for-service-measure-results-subheader",
  text: "Fee-For-Service Measure Results",
};

export const managedCareMeasureResultsSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  id: "managed-care-measure-results-subheader",
  text: "Managed Care Measure Results",
};

export const measurementPeriodDateRange: DateRangeTemplate = {
  type: ElementType.DateRange,
  id: "measurement-period",
  labels: {
    top: "Measurement period dates",
    start: "Measurement start date",
    end: "Measurement end date",
  },
  helperText:
    "Select the measurement period start and end dates for this individual metric.",
  required: true,
};

export const isTheStateReportingThisMeasure: RadioTemplate = {
  type: ElementType.Radio,
  label: "Is the state reporting on this measure?",
  helperText:
    "Warning: Changing this response will clear any data previously entered in this measure.",
  id: "measure-reporting-radio",
  choices: [
    { label: "Yes, the state is reporting on this measure.", value: "yes" },
    {
      label: "No, CMS is reporting this measure on the state's behalf.",
      value: "no",
    },
  ],
  required: true,
  clickAction: "qmReportingChange",
};

export const wereTheResultsAudited: RadioTemplate = {
  type: ElementType.Radio,
  id: "measure-audited-radio",
  label: "Were the reported measure results audited or validated?",
  choices: [
    { label: "No", value: "no" },
    {
      label: "Yes",
      value: "yes",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "measure-audited-entity",
          label:
            "Enter the name of the entity that conducted the audit or validation.",
          required: true,
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

export const whatSpecificationsAreYouUsing: RadioTemplate = {
  type: ElementType.Radio,
  label: "What technical specifications are being used to report this measure?",
  id: "measure-tech-specs-radio",
  required: true,
  choices: [
    {
      label:
        "National Committee for Quality Assurance (NCQA)/Healthcare Effectiveness Data and Information Set (HEDIS)",
      value: "hedis",
    },
    { label: "Centers for Medicare and Medicaid Services (CMS)", value: "cms" },
  ],
  helperText:
    "Select the technical specifications the state used to report this measure.",
};

export const didYouFollowSpecificationsHintTextLink: RadioTemplate = {
  type: ElementType.Radio,
  label: `Did you follow, with no variance, the most current technical specifications?`,
  id: "measure-following-tech-specs-with-link",
  choices: [
    { label: "Yes", value: "yes" },
    {
      label: "No",
      value: "no",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "measure-following-tech-specs-no-explain-with-link",
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
  helperText:
    '<a href="https://www.medicaid.gov/license/form/8586/3396" class="tech-spec-link" target="_blank">View Current Technical Specifications<img src="/icon_external_link_main.svg" class="tech-spec-icon-hint-size" alt="(Opens in a new tab)"></a>',
};

export const measureDeliveryMethodsSubheader: PageElement[] = [
  divider,
  {
    type: ElementType.SubHeader,
    text: "Measure Delivery Methods",
    id: "measure-delivery-methods-subheader",
    hideCondition: {
      controllerElementId: "measure-reporting-radio",
      answer: "no",
    },
  } as SubHeaderTemplate,
];

export const whichVersionQualityMeasureReported: RadioTemplate = {
  type: ElementType.Radio,
  id: "delivery-method-radio",
  label: "Which delivery methods will be reported on for this measure?",
  choices: [
    { label: "Fee-For-Service (FFS LTSS)", value: "FFS" },
    {
      label: "Managed Care (MLTSS)",
      value: "MLTSS",
    },
    { label: "Both FFS and MLTSS (separate)", value: "FFS,MLTSS" },
  ],
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
  required: true,
  helperText:
    "Warning: Changing this response will clear any data previously entered in the corresponding delivery system measure results sections.",
  clickAction: "qmDeliveryMethodChange",
};

export const enterMeasureResultsSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  text: "Enter Measure Results",
  id: "quality-measures-subheader",
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

export const measureResultsNavigationTable: MeasureResultsNavigationTableTemplate =
  {
    type: ElementType.MeasureResultsNavigationTable,
    measureDisplay: "quality",
    id: "measure-results-navigation-table",
    hideCondition: {
      controllerElementId: "measure-reporting-radio",
      answer: "no",
    },
  };

export const measureFooter: MeasureFooterTemplate = {
  type: ElementType.MeasureFooter,
  id: "measure-footer",
  completeMeasure: true,
  clear: true,
};

//Rates for LTSS-1 / FFS
export const performanceRatesAssessmentFfsElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-assessment",
  required: true,
  hint: "Statistically valid random sample of participants enrolled in Medicaid FFS LTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "assess-of-core",
      label: "Assessment of Core Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who had an LTSS comprehensive assessment (containing all 10 core elements) within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who had an LTSS comprehensive assessment with 10 core elements documented within 90 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
    {
      id: "assess-of-supplemental",
      label: "Assessment of Supplemental Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who had an LTSS comprehensive assessment (containing all 10 core elements and at least 12 supplemental elements) within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who had an LTSS comprehensive assessment with 10 core elements and at least 12 supplemental elements documented within 90 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
  ],
};

export const exclusionRatesAssessmentFfsElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  hint: "Number of participants who have been enrolled in Medicaid FFS LTSS for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  required: true,
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who could not be contacted for LTSS comprehensive assessment within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of participants who could not be contacted for an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
    {
      id: "part-refuse-assess",
      label: "Participant Refused Assessment",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who refused an LTSS comprehensive assessment.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of participants who refused an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
  ],
};

//Rates for LTSS-1 / MLTSS
export const performanceRatesAssessmentMltssElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-assessment",
  required: true,
  hint: "Statistically valid random sample of participants enrolled in Medicaid MLTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "assess-of-core",
      label: "Assessment of Core Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who had an LTSS comprehensive assessment (containing all 10 core elements) within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid MLTSS participants who had an LTSS comprehensive assessment with 10 core elements documented within 90 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
    {
      id: "assess-of-supplemental",
      label: "Assessment of Supplemental Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who had an LTSS comprehensive assessment (containing all 10 core elements and at least 12 supplemental elements) within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid MLTSS participants who had an LTSS comprehensive assessment with 10 core elements and at least 12 supplemental elements documented within 90 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
  ],
};

export const exclusionRatesAssessmentMltssElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  hint: "Number of participants who have been enrolled in Medicaid MLTSS plan for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  required: true,
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who could not be contacted for LTSS comprehensive assessment within, either, 90 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of participants who could not be contacted for an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
    {
      id: "part-refuse-assess",
      label: "Participant Refused Assessment",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who refused an LTSS comprehensive assessment.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of participants who refused an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
  ],
};

//Rates for LTSS-2 / FFS
export const performanceRatesPersonPlanFfsElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-performance",
  required: true,
  hint: "Statistically valid random sample of participants enrolled in Medicaid FFS LTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "person-plan-core",
      label: "Person-Centered Plan with Core Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who had an LTSS comprehensive person-centered plan (containing all 10 core elements) within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who had an LTSS comprehensive person-centered plan with 10 core elements documented within 120 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
    {
      id: "person-plan-supplemental",
      label: "Person-Centered Plan with Supplemental Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who had an LTSS comprehensive person-centered plan (containing all 10 core elements and at least 4 supplemental elements) within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who had an LTSS comprehensive person-centered plan with 10 core elements and at least 4 supplemental elements documented within 120 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
  ],
};

export const exclusionRatesPersonPlanFfsElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  required: true,
  hint: "Number of participants who have been enrolled in Medicaid FFS LTSS for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who could not be contacted for an LTSS comprehensive person-centered plan within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of participants who could not be contacted for an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
    {
      id: "part-refuse-planning",
      label: "Participant Refused Person-Centered Planning",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who refused an LTSS comprehensive person-centered plan.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of participants who refused an LTSS comprehensive person-centered plan. Auto-calculates.",
      },
    },
  ],
};

//Rates for LTSS-2 / MLTSS
export const performanceRatesPersonPlanMltssElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-performance",
  required: true,
  hint: "Statistically valid random sample of participants enrolled in Medicaid MLTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "person-plan-core",
      label: "Person-Centered Plan with Core Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who had an LTSS comprehensive person-centered plan (containing all 10 core elements) within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of Medicaid MLTSS participants who had an LTSS comprehensive person-centered plan with 10 core elements documented within 120 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
    {
      id: "person-plan-supplemental",
      label: "Person-Centered Plan with Supplemental Elements",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who had an LTSS comprehensive person-centered plan (containing all 10 core elements and at least 4 supplemental elements) within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of Medicaid MLTSS participants who had an LTSS comprehensive person-centered plan with 10 core elements and at least 4 supplemental elements documented within 120 days of enrollment (for new participants) or during the measurement year (for established participants). Auto-calculates.",
      },
    },
  ],
};

export const exclusionRatesPersonPlanMltssElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  required: true,
  hint: "Number of participants who have been enrolled in Medicaid MLTSS for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who could not be contacted for an LTSS comprehensive person-centered plan within, either, 120 days of enrollment for new participants, or at least once during the measurement year for established participants.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of participants who could not be contacted for an LTSS comprehensive assessment. Auto-calculates.",
      },
    },
    {
      id: "part-refuse-planning",
      label: "Participant Refused Person-Centered Planning",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who refused an LTSS comprehensive person-centered plan.",
        hintDenominator: "Auto-populates.",
        hintRate:
          "Percentage of participants who refused an LTSS comprehensive person-centered plan. Auto-calculates.",
      },
    },
  ],
};

//Rates for LTSS-3 / FFS
export const performanceRatesPersonCenteredPlanFfsElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-transmitted",
    required: true,
    hint: "Statistically valid random sample of participants enrolled in Medicaid FFS LTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
    assessments: [
      {
        id: "pc-plan",
        label: "Participant with Person-Centered Plan Transmitted to PCP",
        hints: {
          hintNumerator:
            "Number of Medicaid FFS LTSS participants whose person-centered plan was transmitted to their PCP (or other documented medical care provider) identified by the participant within 30 days of the date when the participant agreed to the person-centered plan.",
          hintDenominator: "Auto-populates.",
          hintRate:
            "Percentage of Medicaid FFS LTSS participants whose person-centered plan was transmitted to the PCP (or other documented medical care provider) identified by the participant within 30 days of the date when the participant agreed to the person-centered plan.",
        },
      },
    ],
  };

export const exclusionRatesPersonCenteredPlanFfsElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-refused",
    label: "Exclusion Rate",
    required: true,
    hint: "Number of participants who have been enrolled in Medicaid FFS LTSS plan for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
    assessments: [
      {
        id: "refused-pc-plan",
        label: "Participant Refused to Share Person-Centered Plan",
        hints: {
          hintNumerator:
            "Number of Medicaid FFS LTSS participants who refused to allow the person-centered plan to be shared.",
          hintDenominator: "Auto-populates.",
          hintRate:
            "Percentage of Medicaid FFS LTSS participants who refused to have the person-centered plan shared with a PCP (or other documented medical care provider).",
        },
      },
    ],
  };

//Rates for LTSS-3 / MLTSS
export const performanceRatesPersonCenteredPlanMltssElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-transmitted",
    required: true,
    hint: "Statistically valid random sample of participants enrolled in Medicaid MLTSS for at least 150 days, continuously between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
    assessments: [
      {
        id: "pc-plan",
        label: "Participant with Person-Centered Plan Transmitted to PCP",
        hints: {
          hintNumerator:
            "Number of Medicaid MLTSS participants whose person-centered plan was transmitted to their PCP (or other documented medical care provider) identified by the participant within 30 days of the date when the participant agreed to the person-centered plan.",
          hintDenominator: "Auto-populates.",
          hintRate:
            "Percentage of Medicaid MLTSS participants whose person-centered plan was transmitted to the PCP (or other documented medical care provider) identified by the participant within 30 days of the date when the participant agreed to the person-centered plan.",
        },
      },
    ],
  };

export const exclusionRatesPersonCenteredPlanMltssElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-refused",
    label: "Exclusion Rate",
    required: true,
    hint: "Number of participants who have been enrolled in Medicaid MLTSS plan for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
    assessments: [
      {
        id: "refused-pc-plan",
        label: "Participant Refused to Share Person-Centered Plan",
        hints: {
          hintNumerator:
            "Number of Medicaid MLTSS participants who refused to allow the person-centered plan to be shared.",
          hintDenominator: "Auto-populates.",
          hintRate:
            "Percentage of Medicaid MLTSS participants who refused to have the person-centered plan shared with a PCP (or other documented medical care provider).",
        },
      },
    ],
  };

//Rates for LTSS-4 / FFS
export const performanceRatesReassessmentPlanFfsElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-reassessment",
    required: true,
    hint: "A statistically valid random sample of acute or non-acute inpatient discharges for an unplanned admission between January 1 and December 1 of the measurement year.",
    assessments: [
      {
        id: "reassessment-plan-core",
        label: "Reassessment after Inpatient Discharge",
        hints: {
          hintNumerator:
            "Number of participants who received an LTSS reassessment on the date of discharge or within 30 days after discharge.",
          hintDenominator: "Auto-populates",
          hintRate:
            "Percentage of discharges from inpatient facilities for Medicaid FFS LTSS participants that result in an LTSS reassessment within 30 days following discharge.",
        },
      },
      {
        id: "reassessment-plan-supplemental",
        label: "Reassessment of Person-Centered Plan after Inpatient Discharge",
        hints: {
          hintNumerator:
            "Number of participants who received an LTSS reassessment and person-centered plan update on the date of discharge or within 30 days after discharge.",
          hintDenominator: "Auto-populates",
          hintRate:
            "Percentage of discharges from inpatient facilities for Medicaid FFS LTSS participants that result in an LTSS reassessment and person-centered plan update within 30 days following discharge.",
        },
      },
    ],
  };

export const exclusionRatesPatientPlanFfsElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  required: true,
  hint: "Number of participants who have been enrolled in Medicaid FFS LTSS for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "patient-not-contact",
      label: "Patient Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who could not be contacted for reassessment and update to the person-centered plan following inpatient discharge.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who could not be contacted for reassessment or person-centered plan updates following inpatient discharges.",
      },
    },
    {
      id: "patient-refuse-planning",
      label: "Patient Refused Person-Centered Planning",
      hints: {
        hintNumerator:
          "Number of Medicaid FFS LTSS participants who refused to participate in reassessment or update to an LTSS person-centered plan following inpatient discharge.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid FFS LTSS participants who refused reassessment or update to an LTSS person-centered plan following inpatient discharge.",
      },
    },
  ],
};

//Rates for LTSS-4 / MLTSS
export const performanceRatesReassessmentPlanMltssElements: MultiRateNdrTemplate =
  {
    type: ElementType.MultiRateNdr,
    id: "measure-rates-reassessment",
    required: true,
    hint: "A statistically valid random sample of acute or non-acute inpatient discharges for an unplanned admission between January 1 and December 1 of the measurement year.",
    assessments: [
      {
        id: "reassessment-plan-core",
        label: "Reassessment after Inpatient Discharge",
        hints: {
          hintNumerator:
            "Number of participants who received an LTSS reassessment on the date of discharge or within 30 days after discharge.",
          hintDenominator: "Auto-populates",
          hintRate:
            "Percentage of discharges from inpatient facilities for Medicaid MLTSS participants that result in an LTSS reassessment within 30 days following discharge.",
        },
      },
      {
        id: "reassessment-plan-supplemental",
        label: "Reassessment of Person-Centered Plan after Inpatient Discharge",
        hints: {
          hintNumerator:
            "Number of participants who received an LTSS reassessment and person-centered plan update on the date of discharge or within 30 days after discharge.",
          hintDenominator: "Auto-populates",
          hintRate:
            "Percentage of discharges from inpatient facilities for Medicaid MLTSS participants that result in an LTSS reassessment and person-centered plan update within 30 days following discharge.",
        },
      },
    ],
  };

export const exclusionRatesPatientPlanMltssElements: MultiRateNdrTemplate = {
  type: ElementType.MultiRateNdr,
  id: "measure-rates-exclusion",
  label: "Exclusion Rate",
  required: true,
  hint: "Number of participants who have been enrolled in Medicaid MLTSS plan for at least 150 days, continuously, between August 1 of the year prior to the measurement year and December 31 of the measurement year.",
  assessments: [
    {
      id: "patient-not-contact",
      label: "Patient Could Not be Contacted",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who could not be contacted for reassessment and update to the person-centered plan following inpatient discharge.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid MLTSS participants who could not be contacted for reassessment or person-centered plan updates following inpatient discharges.",
      },
    },
    {
      id: "patient-refuse-planning",
      label: "Patient Refused Person-Centered Planning",
      hints: {
        hintNumerator:
          "Number of Medicaid MLTSS participants who refused to participate in reassessment or update to an LTSS person-centered plan following inpatient discharge.",
        hintDenominator: "Auto-populates",
        hintRate:
          "Percentage of Medicaid MLTSS participants who refused reassessment or update to an LTSS person-centered plan following inpatient discharge.",
      },
    },
  ],
};

//Rates for POM
export const performanceRatePOM: Omit<NdrTemplate, "label"> = {
  type: ElementType.Ndr,
  id: "measure-rates",
  required: true,
};

// Rates for LTSS-6 / FFS
export const performanceRateTermStayFfsElements: MultiCategoryNdrTemplate = {
  type: ElementType.MultiCategoryNdr,
  id: "measure-rates",
  assessments: [
    { id: "year-1", label: "18 to 64 Years" },
    { id: "year-2", label: "65 to 74 Years" },
    { id: "year-3", label: "75 to 84 Years" },
    { id: "year-4", label: "85 years or older" },
  ],
  hint: "Number of participant months where the participant was residing in the community for at least one day of the month.",
  hintNumerator:
    "Number of facility admissions from a community residence from August 1 of the year prior to the measurement year through July 31 of the measurement year.",
  categories: [
    {
      id: "short-term",
      label: "Short Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of 1 to 20 days per 1,000 Medicaid FFS LTSS participant months.",
    },
    {
      id: "med-term",
      label: "Medium Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of 21 to 100 days per 1,000 Medicaid FFS LTSS participant months.",
    },
    {
      id: "long-term",
      label: "Long Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of more than 100 days per 1,000 Medicaid FFS LTSS participant months.",
    },
  ],
  required: true,
  multiplier: 1000,
};

// Rates for LTSS-6 / MLTSS
export const performanceRateTermStayMltssElements: MultiCategoryNdrTemplate = {
  type: ElementType.MultiCategoryNdr,
  id: "measure-rates",
  assessments: [
    { id: "year-1", label: "18 to 64 Years" },
    { id: "year-2", label: "65 to 74 Years" },
    { id: "year-3", label: "75 to 84 Years" },
    { id: "year-4", label: "85 years or older" },
  ],
  hint: "Number of participant months where the participant was residing in the community for at least one day of the month.",
  hintNumerator:
    "Number of facility admissions from a community residence from August 1 of the year prior to the measurement year through July 31 of the measurement year.",
  categories: [
    {
      id: "short-term",
      label: "Short Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of 1 to 20 days per 1,000 Medicaid MLTSS participant months.",
    },
    {
      id: "med-term",
      label: "Medium Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of 21 to 100 days per 1,000 Medicaid MLTSS participant months.",
    },
    {
      id: "long-term",
      label: "Long Term Stay",
      hintRate:
        "Rate of Admissions resulting in a stay of more than 100 days per 1,000 Medicaid MLTSS participant months.",
    },
  ],
  required: true,
  multiplier: 1000,
};

//Rates for LTSS-7
export const performanceRateFacilityDischarges: LengthOfStayRateTemplate = {
  type: ElementType.LengthOfStayRate,
  id: "measure-rates",
  labels: {
    actualCount: "Count of Successful Discharges to the Community",
    denominator: "Facility Admission Count",
    expectedCount: "Expected Count of Successful Discharges to the Community",
    populationRate: "Multi-Plan Population Rate",
    actualRate:
      "Observed Performance Rate for Minimizing Length of Facility Stay",
    expectedRate:
      "Expected Performance Rate for Minimizing Length of Facility Stay",
    adjustedRate: "Risk Adjusted Rate for Minimizing Length of Facility Stay",
  },
  required: true,
};

// Rates for MLTSS: Plan All-Cause Readmission
export const readmissionRate: ReadmissionRateTemplate = {
  type: ElementType.ReadmissionRate,
  id: "measure-rates",
  labels: {
    stayCount: "Count of Index Hospital Stays",
    obsReadmissionCount: "Count of Observed 30-Day Readmissions",
    obsReadmissionRate: "Observed Readmission Rate",
    expReadmissionCount: "Count of Expected 30-Day readmissions",
    expReadmissionRate: "Expected Readmission Rate",
    obsExpRatio: "Observed-to-Expected Ratio",
    beneficiaryCount: "Count of Beneficiaries in Medicaid Population",
    outlierCount: "Number of Outliers",
    outlierRate: "Outlier Rate",
  },
  required: true,
};

//Rates for LTSS-8
export const performanceRateFacilityTransitions: LengthOfStayRateTemplate = {
  type: ElementType.LengthOfStayRate,
  id: "measure-rates",
  labels: {
    actualCount: "Count of Successful Transitions to the Community",
    denominator: "Long-Term Facility Stay Count",
    expectedCount: "Expected Count of Successful Transitions to the Community",
    populationRate: "Multi-Plan Population Rate",
    actualRate:
      "Observed Performance Rate for Successful Transition after Long-Term Facility Stay",
    expectedRate:
      "Expected Performance Rate for Successful Transition after Long-Term Facility Stay",
    adjustedRate:
      "Risk Adjusted Rate for Successful Transition after Long-Term Facility Stay",
  },
  required: true,
};

// Rates for HCBS-10
export const performanceRateSelfDirection: MultiCategoryNdrTemplate = {
  type: ElementType.MultiCategoryNdr,
  id: "measure-rates",
  required: true,
  assessments: [
    {
      id: "self-direction-offer",
      label: "Self-Direction Offer",
      hints: {
        hintNumerator:
          "Number of MLTSS plan participants aged 18 years and older who received an offer to self-direct their HCBS in the last 12 months.",
        hintDenominator:
          "Number of participants receiving HCBS aged 18 and older enrolled in MLTSS plans who were eligible to self-direct their HCBS.",
        hintRate:
          "Percentage of eligible participants receiving HCBS aged 18 years and older in MLTSS plans who were offered the option to self-direct their services in the last 12 months.",
      },
    },
    {
      id: "self-direction-opt-in",
      label: "Self-Direction Opt-In",
      hints: {
        hintNumerator:
          "Number of MLTSS plan participants aged 18 years and older who opted into self-direction to receive at least one of their HCBS in the last 12 months.",
        hintDenominator:
          "Number of participants aged 18 and older enrolled in MLTSS plans receiving HCBS who opted to self-direct at least one of their HCBS in the last 12 months.",
        hintRate:
          "Percentage of participants receiving HCBS aged 18 years and older in MLTSS plans who opted to self-direct their services, among those who were offered the option to self-direct in the last 12 months.",
      },
    },
  ],
  categories: [
    { id: "self-label", label: "Total" },
    { id: "18-to-64-years", label: "18 to 64 Years" },
    { id: "65-years-or-older", label: "65 years or older" },
  ],
};

export const sectionCompleteBanner: StatusAlertTemplate = {
  type: ElementType.StatusAlert,
  id: "status-alert",
  title: "This section has been completed",
  text: "You can still edit this section, but the measure status will change to ‘In progress,’ and you will need to re-select the ‘Complete section’ button. {ReturnButton} or select the ‘Return to measure information’ button above to return to the previous page.",
  status: AlertTypes.SUCCESS,
};

export const measureCompleteBanner: StatusAlertTemplate = {
  type: ElementType.StatusAlert,
  id: "status-alert",
  title: "This measure has been completed",
  text: "You can still edit the measure, but the measure status will change to ‘In progress,’ and you will need to re-select the ‘Complete measure’ button. {ReturnButton} or select the ‘Return to measure dashboard’ button above to return to the previous page.",
  status: AlertTypes.SUCCESS,
};
