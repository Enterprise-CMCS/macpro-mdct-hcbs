import {
  AccordionTemplate,
  ButtonLinkTemplate,
  ElementType,
  HeaderTemplate,
  MeasureDetailsTemplate,
  MeasureFooterTemplate,
  MeasureResultsNavigationTableTemplate,
  ParagraphTemplate,
  PerformanceRateTemplate,
  PerformanceRateType,
  RadioTemplate,
  RateCalc,
  ReportingRadioTemplate,
  SubHeaderTemplate,
  TextAreaBoxTemplate,
} from "../../types/reports";

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

export const measureHeader: HeaderTemplate = {
  type: ElementType.Header,
  id: "measure-header",
  text: "{measureName}",
};

export const measureInstructions: AccordionTemplate = {
  type: ElementType.Accordion,
  id: "measure-instructions",
  label: "Instructions",
  value:
    "[Optional instructional content that could support the user in completing this page]",
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

export const isTheStateReportingThisMeasure: ReportingRadioTemplate = {
  type: ElementType.ReportingRadio,
  label: "Is the state reporting on this measure?",
  id: "measure-reporting-radio",
  value: [
    { label: "Yes, the state is reporting on this measure", value: "yes" },
    {
      label: "No, CMS is reporting this measure on the state's behalf",
      value: "no",
    },
  ],
};

export const wereTheResultsAudited: RadioTemplate = {
  type: ElementType.Radio,
  id: "measure-audited-radio",
  label: "Were the reported measure results audited or validated?",
  value: [
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
        },
      ],
    },
  ],
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

export const whatSpecificationsAreYouUsing: RadioTemplate = {
  type: ElementType.Radio,
  label: "What Technical Specifications are you using to report this measure?",
  id: "measure-tech-specs-radio",
  value: [
    { label: "CMS", value: "cms" },
    { label: "HEDIS", value: "hedis" },
  ],
};

export const didYouFollowSpecifications: RadioTemplate = {
  type: ElementType.Radio,
  label: "Did you follow the [reportYear] Technical Specifications?",
  id: "measure-following-tech-specs",
  value: [
    { label: "Yes", value: "yes" },
    {
      label: "No",
      value: "no",
      checkedChildren: [
        {
          type: ElementType.TextAreaField,
          id: "measure-following-tech-specs-no-explain",
          label: "Please explain the variance.",
        },
      ],
    },
  ],
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

export const additionalNotesField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "additional-notes-field",
  helperText:
    "If applicable, add any notes or comments to provide context to the reported measure result",
  label: "Additional notes/comments (optional)",
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

export const whichDeliverySystemsWereUsed: RadioTemplate = {
  type: ElementType.Radio,
  id: "delivery-method-radio",
  label: "Which delivery systems were used to report this measure?",
  value: [
    { label: "Fee-For-Service (FFS)", value: "FFS" },
    {
      label: "Managed Long-Term Services and Supports (MLTSS)",
      value: "MLTSS",
    },
    { label: "Both FFS and MLTSS (separate)", value: "FFS,MLTSS" },
  ],
  hideCondition: {
    controllerElementId: "measure-reporting-radio",
    answer: "no",
  },
};

export const qualityMeasuresSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  text: "Quality Measures",
  id: "quality-measures-subheader",
};

export const measureResultsNavigationTable: MeasureResultsNavigationTableTemplate =
  {
    type: ElementType.MeasureResultsNavigationTable,
    measureDisplay: "quality",
    id: "measure-results-navigation-table",
  };

export const measureFooter: MeasureFooterTemplate = {
  type: ElementType.MeasureFooter,
  id: "measure-footer",
  prevTo: "req-measure-result",
  completeMeasure: true,
  clear: true,
};

export const whichMedicaidHCBSprograms: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "measure-programs-text",
  label: "Which Medicaid HCBS programs are being reported? (optional)",
  helperText:
    "Please provide waiver, SPA or 1115 demonstration names and associated control numbers.",
};

export const stratificationSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  id: "measure-subheader-stratification",
  text: "Measure Stratification",
};

export const stratificationParagraph: ParagraphTemplate = {
  type: ElementType.Paragraph,
  id: "measure-strat-paragraph",
  text: "If the stratification factor applies to this measure, select it and enter the stratified measure results specific to the demographic group. Do not select categories and sub-classifications for which you will not be reporting any data.",
};

export const areYouReportingStratification: RadioTemplate = {
  type: ElementType.Radio,
  id: "reporting-strat-radio",
  label: "Are you reporting stratification for this measure?",
  value: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ],
};

//Rates for LTSS-1
export const performanceRatesAssessmentElements: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  rateType: PerformanceRateType.NDR_Enhanced,
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    {
      id: "assess-of-core",
      label: "Assessment of Core Elements",
    },
    {
      id: "assess-of-supplemental",
      label: "Assessment of Supplemental Elements",
    },
  ],
};

export const exclusionRatesAssessmentElements: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  label: "Exclusion Rates",
  rateType: PerformanceRateType.NDR_Enhanced,
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    {
      id: "part-not-connect",
      label: "Participant Could Not be Contacted",
    },
    {
      id: "part-refuse-assess",
      label: "Participant Refused Assessment",
    },
  ],
};

//Rates for LTSS-2
export const performanceRatesPersonPlanElements: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  rateType: PerformanceRateType.NDR_Enhanced,
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    {
      id: "person-plan-core",
      label: "Person-Centered Plan with Core Elements",
    },
    {
      id: "person-plan-supplemental",
      label: "Person-Centered Plan with Supplemental Elements",
    },
  ],
};

export const exclusionRatesPersonPlanElements: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  label: "Exclusion Rates",
  rateType: PerformanceRateType.NDR_Enhanced,
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
    },
    {
      id: "part-refuse-planning",
      label: "Participant Refused Person-Centered Planning",
    },
  ],
};

//Rates for POM
export const performanceRatePOM: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  rateType: PerformanceRateType.NDR,
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    {
      id: "same-env",
      label: "Person uses the same environments as people without disabilities",
    },
  ],
};

//Rates for LTSS-7
export const performanceRateFacility: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  fields: [
    {
      id: "count-of-success",
      label: "Count of Successful Discharges to the Community",
    },
    { id: "fac-admin-count", label: "Facility Admission Count" },
    {
      id: "expected-count-of-success",
      label: "Expected Count of Successful Discharges to the Community",
    },
    { id: "multi-plan", label: "Multi-Plan Population Rate" },
    {
      id: "opr-min-stay",
      label: "Observed Performance Rate for Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "epr-min-stay",
      label: "Expected Performance Rate for Minimizing Length of Facility Stay",
      autoCalc: true,
    },
    {
      id: "rar-min-stay",
      label: "Risk Adjusted Rate for Minimizing Length of Facility Stay",
      autoCalc: true,
    },
  ],
  rateType: PerformanceRateType.FIELDS,
  rateCalc: RateCalc.FacilityLengthOfStayCalc,
};

export const performanceRateTermStay: PerformanceRateTemplate = {
  type: ElementType.PerformanceRate,
  id: "measure-rates",
  helperText:
    "The performance rate is based on a review of this measure’s participant case management records, selected via a systematic sample drawn from the eligible population.",
  assessments: [
    { id: "year-1", label: "18 to 64 Years" },
    { id: "year-2", label: "65 to 74 Years" },
    { id: "year-3", label: "75 to 84 Years" },
    { id: "year-4", label: "85 years or older" },
  ],
  fields: [
    { id: "short-term", label: "Short Term Stay" },
    { id: "med-term", label: "Medium Term Stay" },
    { id: "long-term", label: "Long Term Stay" },
  ],
  rateType: PerformanceRateType.NDRFIELDS,
  multiplier: 1000,
};
