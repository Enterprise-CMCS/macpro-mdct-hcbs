import {
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
} from "../../types/reports";
import {
  additionalNotesField,
  didYouFollowSpecifications,
  doYouWantCmsToCalculateOnYourBehalf,
  isTheStateReportingThisMeasure,
  measureDetailsSection,
  measureFooter,
  measureHeader,
  measureInformationSubheader,
  measureInstructions,
  qualityMeasuresSubheader,
  qualityMeasureTable,
  returnToOptionalDashboard,
  returnToRequiredDashboard,
  wereTheResultsAudited,
  whatSpecificationsAreYouUsing,
  whichDeliverySystemsWereUsed,
  whichMedicaidHCBSprograms,
  feeForServiceMeasureResultsSubheader,
  managedCareMeasureResultsSubheader,
  performanceRatesSubheader,
  performanceRateAutoCalculates,
  performanceRateNum,
  performanceRateTarget,
  performanceRatesDenomTextbox,
  performanceRatesDenomAutoCalculates,
  exclusionRatesMeasureSubheader,
  exclusionRatesDenomAutoCalculates,
  exclusionRateNum,
  exclusionRatesDenomTextBox,
  stratificationSubheader,
  stratificationParagraph,
  areYouReportingStratification,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-1"]]: {
    id: "FFS-1",
    title: "LTSS-1: Fee-For-Service Measure Results",
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
        text: "LTSS-1: Fee-For-Service Measure Results",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesSubheader,
      performanceRatesDenomTextbox,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Assessment of Core Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Assessment of Supplemental Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      exclusionRatesMeasureSubheader,
      exclusionRatesDenomTextBox,
      {
        type: ElementType.NestedHeading,
        id: "measure-nested-heading",
        text: "Exclusion Rate: Participant Count Not Be Contacted",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Exclusion Rate: Participant Refused Assessment",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
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
    title: "LTSS-1: Managed Care Measure Results",
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
        text: "LTSS-1: Managed Care Measure Results",
      },
      measureInstructions,
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesSubheader,
      performanceRatesDenomTextbox,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Assessment of Core Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Assessment of Supplemental Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      exclusionRatesMeasureSubheader,
      exclusionRatesDenomTextBox,
      {
        type: ElementType.NestedHeading,
        id: "measure-nested-heading",
        text: "Exclusion Rate: Participant Count Not Be Contacted",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Exclusion Rate: Participant Refused Assessment",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
    ],
  },
  [MeasureTemplateName["FFS-2"]]: {
    id: "FFS-2",
    title: "LTSS-2: Fee-For-Service Measure Results",
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
        text: "LTSS-2: Fee-For-Service Measure Results",
      },
      measureInstructions,
      feeForServiceMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesSubheader,
      performanceRatesDenomTextbox,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Person-Centered Plan with Core Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Person-Centered Plan with Supplemental Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      exclusionRatesMeasureSubheader,
      exclusionRatesDenomTextBox,
      {
        type: ElementType.NestedHeading,
        id: "measure-nested-heading",
        text: "Exclusion Rate: Participant Count Not Be Contacted",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Exclusion Rate: Participant Refused Person-Centered Planning",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
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
    title: "LTSS-2: Managed Care Measure Results",
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
        text: "LTSS-2: Managed Care Measure Results",
      },
      measureInstructions,
      managedCareMeasureResultsSubheader,
      whichMedicaidHCBSprograms,
      performanceRatesSubheader,
      performanceRatesDenomTextbox,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Person-Centered Plan with Core Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Performance Rate: Person-Centered Plan with Supplemental Elements",
      },
      performanceRateTarget,
      performanceRateNum,
      performanceRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      exclusionRatesMeasureSubheader,
      exclusionRatesDenomTextBox,
      {
        type: ElementType.NestedHeading,
        id: "measure-nested-heading",
        text: "Exclusion Rate: Participant Count Not Be Contacted",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
      {
        type: ElementType.NestedHeading,
        id: "measure-subheader",
        text: "Exclusion Rate: Participant Refused Person-Centered Planning",
      },
      exclusionRateNum,
      exclusionRatesDenomAutoCalculates,
      performanceRateAutoCalculates,
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
      wereTheResultsAudited,
      didYouFollowSpecifications,
      doYouWantCmsToCalculateOnYourBehalf,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      wereTheResultsAudited,
      didYouFollowSpecifications,
      doYouWantCmsToCalculateOnYourBehalf,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      wereTheResultsAudited,
      didYouFollowSpecifications,
      doYouWantCmsToCalculateOnYourBehalf,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      didYouFollowSpecifications,
      additionalNotesField,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      whatSpecificationsAreYouUsing,
      didYouFollowSpecifications,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      didYouFollowSpecifications,
      additionalNotesField,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
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
      isTheStateReportingThisMeasure,
      wereTheResultsAudited,
      didYouFollowSpecifications,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      isTheStateReportingThisMeasure,
      didYouFollowSpecifications,
      wereTheResultsAudited,
      additionalNotesField,
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
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
      whichDeliverySystemsWereUsed,
      qualityMeasuresSubheader,
      qualityMeasureTable,
      measureFooter,
    ],
  },
};
