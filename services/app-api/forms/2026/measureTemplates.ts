import {
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
  PerformanceRateType,
} from "../../types/reports";
import {
  additionalNotesField,
  didYouFollowSpecifications,
  isTheStateReportingThisMeasure,
  measureDetailsSection,
  measureFooter,
  measureHeader,
  measureInformationSubheader,
  measureInstructions,
  enterMeasureResultsSubheader,
  measureResultsNavigationTable,
  returnToOptionalDashboard,
  returnToRequiredDashboard,
  wereTheResultsAudited,
  whatSpecificationsAreYouUsing,
  measureDeliveryMethodsSubheader,
  whichVersionQualityMeasureReported,
  whichMedicaidHCBSprograms,
  feeForServiceMeasureResultsSubheader,
  managedCareMeasureResultsSubheader,
  stratificationSubheader,
  stratificationParagraph,
  areYouReportingStratification,
  exclusionRatesAssessmentElements,
  performanceRatesAssessmentElements,
  performanceRatesPersonPlanElements,
  exclusionRatesPersonPlanElements,
  performanceRateTermStay,
  performanceRateFacilityDischarges,
  performanceRateFacilityTransitions,
} from "./elements";

export const measureTemplates: Record<
  MeasureTemplateName,
  Omit<MeasurePageTemplate, "cmitId" | "status">
> = {
  [MeasureTemplateName["LTSS-1"]]: {
    id: "LTSS-1",
    title: "LTSS-1: Comprehensive Assessment and Update",
    type: PageType.Measure,
    substitutable: MeasureTemplateName["FASI-1"],
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-1"]]: {
    id: "FFS-1",
    title: "LTSS-1: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-1",
      },
      {
        ...measureHeader,
        text: "LTSS-1: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesAssessmentElements,
      exclusionRatesAssessmentElements,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-1",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-1"]]: {
    id: "MLTSS-1",
    title: "LTSS-1: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-1",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-1: Managed Care (MLTSS)",
      },
      measureInstructions,
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesAssessmentElements,
      exclusionRatesAssessmentElements,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-1",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-2"]]: {
    id: "LTSS-2",
    title: "LTSS-2: Comprehensive Person-Centered Plan and Update",
    type: PageType.Measure,
    sidebar: false,
    substitutable: MeasureTemplateName["FASI-2"],
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-2"]]: {
    id: "FFS-2",
    title: "LTSS-2: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-2",
      },
      {
        ...measureHeader,
        text: "LTSS-2: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesPersonPlanElements,
      exclusionRatesPersonPlanElements,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-2",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-2"]]: {
    id: "MLTSS-2",
    title: "LTSS-2: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-2",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-2: Managed Care (MLTSS)",
      },
      measureInstructions,
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesPersonPlanElements,
      exclusionRatesPersonPlanElements,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-2",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-6"]]: {
    id: "LTSS-6",
    title: "LTSS-6: Admission to a Facility from the Community",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      isTheStateReportingThisMeasure,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-6"]]: {
    id: "FFS-6",
    title: "LTSS-6: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-6",
      },
      {
        ...measureHeader,
        text: "LTSS-6: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateTermStay,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-6",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-6"]]: {
    id: "MLTSS-6",
    title: "LTSS-6: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-6",
      },
      {
        ...measureHeader,
        text: "LTSS-6: Managed Care (MLTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateTermStay,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-6",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-7"]]: {
    id: "LTSS-7",
    title: "LTSS-7: Minimizing Facility Length of Stay",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      isTheStateReportingThisMeasure,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-7"]]: {
    id: "FFS-7",
    title: "LTSS-7: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-7",
      },
      {
        ...measureHeader,
        text: "LTSS-7: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateFacilityDischarges,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-7",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-7"]]: {
    id: "MLTSS-7",
    title: "LTSS-7: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-7",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-7: Managed Care (MLTSS)",
      },
      measureInstructions,
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateFacilityDischarges,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-7",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-8"]]: {
    id: "LTSS-8",
    title: "LTSS-8: Successful Transition after Long-Term Facility Stay",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      isTheStateReportingThisMeasure,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-8"]]: {
    id: "FFS-8",
    title: "LTSS-8: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-8",
      },
      {
        ...measureHeader,
        text: "LTSS-8: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateFacilityTransitions,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-8",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-8"]]: {
    id: "MLTSS-8",
    title: "LTSS-8: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-8",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-8: Managed Care (MLTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRateFacilityTransitions,
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-8",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["FASI-1"]]: {
    id: "FASI-1",
    title: "FASI-1: Identification of Person-Centered Priorities",
    substitutable: MeasureTemplateName["LTSS-1"],
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-FASI-1"]]: {
    id: "FFS-FASI-1",
    title: "FASI-1: Fee-For-Service (FFS FASI-1)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "FASI-1",
      },
      {
        ...measureHeader,
        text: "FASI-1: Fee-For-Service (FFS FASI-1)",
      },
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "total-personal-priority",
            label:
              "Participant who has Identified at Least as Many Total Personal Priorities as Functional Needs in the Areas of Self-Care, Mobility, or IADL",
          },
        ],
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "FASI-1",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-FASI-1"]]: {
    id: "MLTSS-FASI-1",
    title: "FASI-1: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "FASI-1",
      },
      {
        ...measureHeader,
        text: "FASI-1: Managed Care (MLTSS)",
      },
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "total-personal-priority",
            label:
              "Participant who has Identified at Least as Many Total Personal Priorities as Functional Needs in the Areas of Self-Care, Mobility, or IADL",
          },
        ],
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "FASI-1",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["FASI-2"]]: {
    id: "FASI-2",
    title: "FASI-2: Documentation of a Person-Centered Service Plan",
    type: PageType.Measure,
    substitutable: MeasureTemplateName["LTSS-2"],
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-FASI-2"]]: {
    id: "FFS-FASI-2",
    title: "FASI-2: Fee-For-Service (FFS FASI-2)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "FASI-2",
      },
      {
        ...measureHeader,
        text: "FASI-2: Fee-For-Service (FFS FASI-2)",
      },
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "total-personal-priority",
            label:
              "Participant who has Identified at Least as Many Total Personal Priorities as Functional Needs in the Areas of Self-Care, Mobility, or IADL",
          },
        ],
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "FASI-2",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-FASI-2"]]: {
    id: "MLTSS-FASI-2",
    title: "FASI-2: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "FASI-2",
      },
      {
        ...measureHeader,
        text: "FASI-2: Managed Care (MLTSS)",
      },
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "total-personal-priority",
            label:
              "Participant who has Identified at Least as Many Total Personal Priorities as Functional Needs in the Areas of Self-Care, Mobility, or IADL",
          },
        ],
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "FASI-2",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["HCBS-10"]]: {
    id: "HCBS-10",
    title:
      "HCBS-10: Self-direction of Services and Supports Among Medicaid Beneficiaries Receiving LTSS through Managed Care Organizations",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["MLTSS-HCBS-10"]]: {
    id: "MLTSS-HCBS-10",
    title: "HCBS-10: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "HCBS-10",
      },
      {
        ...measureHeader,
        text: "HCBS-10: Managed Care (MLTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "self-dir-offer",
            label: "Self-Direction Offer",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        assessments: [
          {
            id: "sd-offer-18-to-64-years-old",
            label: "18 to 64 years old Self-Direction Offer",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        assessments: [
          {
            id: "sd-offer-64-or-older",
            label: "65 years or older Self-Direction Offer",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        assessments: [
          {
            id: "self-dir-opt-in",
            label: "Self-Direction Opt-In",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        assessments: [
          {
            id: "sd-opt-in-18-to-64-years-old",
            label: "18 to 64 years old Self-Direction Opt-In",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        assessments: [
          {
            id: "sd-opt-in-64-or-older",
            label: "65 years or older Self-Direction Opt-In",
          },
        ],
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "HCBS-10",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-3"]]: {
    id: "LTSS-3",
    title: "LTSS-3: Shared Person-Centered Plan with Primary Care Provider",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-3"]]: {
    id: "FFS-3",
    title: "LTSS-3: Fee-For-Service (FFS LTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-3",
      },
      {
        ...measureHeader,
        text: "LTSS-3: Fee-For-Service (FFS LTSS)",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "pc-plan",
            label: "Participant with Person-Centered Plan Transmitted to PCP",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        label: "Exclusion Rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText: "Hint Text",
        assessments: [
          {
            id: "refused-pc-plan",
            label: "Participant Refused to Share Person-Centered Plan",
          },
        ],
      },
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-3",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS-3"]]: {
    id: "MLTSS-3",
    title: "LTSS-3: Managed Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-3",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-3: Managed Care (MLTSS)",
      },
      {
        type: ElementType.Accordion,
        id: "measure-instructions",
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "pc-plan",
            label: "Participant with Person-Centered Plan Transmitted to PCP",
          },
        ],
      },
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        label: "Exclusion Rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText: "Hint Text",
        assessments: [
          {
            id: "refused-pc-plan",
            label: "Participant Refused to Share Person-Centered Plan",
          },
        ],
      },
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-3",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-4"]]: {
    id: "LTSS-4",
    title:
      "LTSS-4: Reassessment and Person-Centered Plan Update after Inpatient Discharge",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["LTSS-5"]]: {
    id: "LTSS-5",
    title:
      "LTSS-5: Screening, Risk Assessment, and Plan of Care to Prevent Future Falls",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["LTSS-5-PT1"]]: {
    id: "LTSS-5-PT1",
    title: "LTSS-5 Part 1: Screening (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-5",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-5 Part 1: Screening (MLTSS)",
      },
      {
        type: ElementType.Accordion,
        id: "measure-instructions",
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "gait-evaulation",
            label: "Fall or Problems with Balance or Gait Evaluation",
          },
        ],
      },
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-5",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["LTSS-5-PT2"]]: {
    id: "LTSS-5-PT2",
    title: "LTSS-5 Part 2: Risk Assessment and Plan of Care (MLTSS)",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Measure Information",
        to: "LTSS-5",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "LTSS-5 Part 2: Risk Assessment and Plan of Care (MLTSS)",
      },
      {
        type: ElementType.Accordion,
        id: "measure-instructions",
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        helperText:
          "The performance rate is based on a review of this measure's participant case management records, selected via a systematic sample drawn from the eligible population.",
        assessments: [
          {
            id: "fall-risk-assess",
            label: "Falls Risk Assessment",
          },
          {
            id: "plan-care-falls",
            label: "Plan of Care for Falls",
          },
        ],
      },

      {
        type: ElementType.PerformanceRate,
        id: "measure-rates",
        rateType: PerformanceRateType.NDR_Enhanced,
        label: "Exclusion Rates",
        helperText: "Hint Text",
        assessments: [
          {
            id: "refused-risk-assess",
            label: "Participant Refused Risk Assessment",
          },
        ],
      },
      stratificationSubheader,
      stratificationParagraph,
      areYouReportingStratification,
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-5",
        completeSection: true,
      },
    ],
  },
  [MeasureTemplateName["MLTSS"]]: {
    id: "MLTSS",
    title: "MLTSS: Plan All-Cause Readmission",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      additionalNotesField,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-1"]]: {
    id: "POM-1",
    title: "POM: People Live in Integrated Environments",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-2"]]: {
    id: "POM-2",
    title: "POM: People Participate in the Life of the Community",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-3"]]: {
    id: "POM-3",
    title: "POM: People Choose Services",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-4"]]: {
    id: "POM-4",
    title: "POM: People Realize Personal Goalss",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-5"]]: {
    id: "POM-5",
    title: "POM: People are Free from Abuse and Neglect",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToRequiredDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-6"]]: {
    id: "POM-6",
    title: "POM: People Have the Best Possible Health",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["POM-7"]]: {
    id: "POM-7",
    title: "POM: People Interact with Other Members of the Community",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      returnToOptionalDashboard,
      measureHeader,
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      measureDeliveryMethodsSubheader,
      whichVersionQualityMeasureReported,
      enterMeasureResultsSubheader,
      measureResultsNavigationTable,
      measureFooter,
    ],
  },
};
