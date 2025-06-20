import {
  AccordionTemplate,
  ButtonLinkTemplate,
  DividerTemplate,
  ElementType,
  HeaderTemplate,
  LengthOfStayRateTemplate,
  MeasureDetailsTemplate,
  MeasureFooterTemplate,
  MeasureResultsNavigationTableTemplate,
  NdrEnhancedTemplate,
  NdrFieldsTemplate,
  NdrTemplate,
  RadioTemplate,
  StatusAlertTemplate,
  SubHeaderMeasureTemplate,
  SubHeaderTemplate,
  TextAreaBoxTemplate,
} from "../../types/reports";

const REPORT_YEAR = 2026;

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

export const divider: DividerTemplate = {
  type: ElementType.Divider,
  id: "divider",
};

export const measureType: SubHeaderMeasureTemplate = {
  type: ElementType.SubHeaderMeasure,
  id: "sub-header-measure",
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

export const didYouFollowSpecifications: RadioTemplate = {
  type: ElementType.Radio,
  label: "Did you follow, with no variance, the 2026 specifications?",
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
          label: "Please explain the variance.",
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
};

export const measureDeliveryMethodsSubheader = [
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

export const whichProgramsWaivers = [
  {
    type: ElementType.TextAreaField,
    id: "measure-programs-text",
    label: "Which programs and waivers are included?",
    helperText:
      "Please specify all the 1915(c) waivers, 1915(i), (j) and (k) State plan benefits and/or 1115 demonstrations that include HCBS that you are including in this report (or measure). Include the program name and control numbers in your response.",
  } as TextAreaBoxTemplate,
  divider,
];

export const statePerformanceTargetLabel = {
  performanceTargetLabel: `What is the ${
    REPORT_YEAR + 2
  } state performance target for this assessment?`,
};

export const stateExclusionTargetLabel = {
  performanceTargetLabel: `What is the ${
    REPORT_YEAR + 2
  } state exclusion rate target for this assessment?`,
};

//Rates for LTSS-1
export const performanceRatesAssessmentElements: NdrEnhancedTemplate = {
  type: ElementType.NdrEnhanced,
  id: "measure-rates",
  ...statePerformanceTargetLabel,
  required: true,
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

export const exclusionRatesAssessmentElements: NdrEnhancedTemplate = {
  type: ElementType.NdrEnhanced,
  id: "measure-rates",
  label: "Exclusion Rate",
  ...stateExclusionTargetLabel,
  required: true,
  assessments: [
    {
      id: "part-not-contact",
      label: "Participant Could Not be Contacted",
    },
    {
      id: "part-refuse-assess",
      label: "Participant Refused Assessment",
    },
  ],
};

//Rates for LTSS-2
export const performanceRatesPersonPlanElements: NdrEnhancedTemplate = {
  type: ElementType.NdrEnhanced,
  id: "measure-rates",
  ...statePerformanceTargetLabel,
  required: true,
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

export const exclusionRatesPersonPlanElements: NdrEnhancedTemplate = {
  type: ElementType.NdrEnhanced,
  id: "measure-rates",
  label: "Exclusion Rate",
  ...stateExclusionTargetLabel,
  required: true,
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
export const performanceRatePOM: NdrTemplate = {
  type: ElementType.Ndr,
  id: "measure-rates",
  required: true,
  label: "Person uses the same environments as people without disabilities",
  ...statePerformanceTargetLabel,
};

//Rates for LTSS-7
export const performanceRateFacilityDischarges: LengthOfStayRateTemplate = {
  type: ElementType.LengthOfStayRate,
  id: "measure-rates",
  labels: {
    performanceTarget: statePerformanceTargetLabel.performanceTargetLabel,
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

//Rates for LTSS-8
export const performanceRateFacilityTransitions: LengthOfStayRateTemplate = {
  type: ElementType.LengthOfStayRate,
  id: "measure-rates",
  labels: {
    performanceTarget: statePerformanceTargetLabel.performanceTargetLabel,
    actualCount: "Count of Successful Transitions to the Community",
    denominator: "Long-Term Facility Stay Count",
    expectedCount: "Expected Count of Successful Transitions to the Community",
    populationRate: "Multi-Plan Population Rate",
    actualRate:
      "Observed Performance Rate for Minimizing Length of Facility Stay",
    expectedRate:
      "Expected Performance Rate for Minimizing Length of Facility Stay",
    adjustedRate: "Risk Adjusted Rate for Minimizing Length of Facility Stay",
  },
  required: true,
};

// Rates for LTSS-6
export const performanceRateTermStay: NdrFieldsTemplate = {
  type: ElementType.NdrFields,
  id: "measure-rates",
  labelTemplate: `What is the ${
    REPORT_YEAR + 2
  } state performance target for {{field}} ({{assessment}})?`,
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
  required: true,
  multiplier: 1000,
};

// Rates for HCBS-10
export const performanceRateSelfDirection: NdrFieldsTemplate = {
  type: ElementType.NdrFields,
  id: "measure-rates",
  labelTemplate: `What is the ${
    REPORT_YEAR + 2
  } state performance target for {{field}} ({{assessment}})?`,
  required: true,
  assessments: [
    { id: "self-direction-offer", label: "Self-Direction Offer" },
    { id: "self-direction-opt-in", label: "Self-Direction Opt-In" },
  ],
  fields: [
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
  status: "success",
};

export const measureCompleteBanner: StatusAlertTemplate = {
  type: ElementType.StatusAlert,
  id: "status-alert",
  title: "This measure has been completed",
  text: "You can still edit the measure, but the measure status will change to ‘In progress,’ and you will need to re-select the ‘Complete measure’ button. {ReturnButton} or select the ‘Return to measure dashboard’ button above to return to the previous page.",
  status: "success",
};
