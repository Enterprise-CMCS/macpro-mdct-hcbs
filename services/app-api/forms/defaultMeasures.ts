import {
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
  MeasureOptions,
} from "../types/reports";
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
} from "./elements";

export const defaultMeasures: MeasureOptions[] = [
  {
    cmit: 960,
    uid: "960",
    required: true,
    stratified: false,
    measureTemplate: [
      MeasureTemplateName["LTSS-1"],
      MeasureTemplateName["FFS-1"],
      MeasureTemplateName["MLTSS"],
    ],
  },
  {
    cmit: 969,
    uid: "969",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["FASI-1"]],
  },
  {
    cmit: 961,
    uid: "961",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-2"]],
  },
  {
    cmit: 970,
    uid: "970",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["FASI-2"]],
  },
  {
    cmit: 20,
    uid: "20",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-6"]],
  },
  {
    cmit: 968,
    uid: "968",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-7"]],
  },
  {
    cmit: 414,
    uid: "414",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-8"]],
  },
  {
    cmit: 111,
    uid: "111",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["HCBS-10"]],
  },
  {
    cmit: 963,
    uid: "963",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-3"]],
  },
  {
    cmit: 962,
    uid: "962",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-4"]],
  },
  {
    cmit: 1255,
    uid: "1255",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["LTSS-5"]],
  },
  {
    cmit: 561,
    uid: "561",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["MLTSS"]],
  },
];

type TemplateMap = Partial<
  Record<MeasureTemplateName, Omit<MeasurePageTemplate, "cmitId" | "status">>
>;

export const defaultMeasureTemplates: TemplateMap = {
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
    title: "LTSS-1: FFS LTSS Measure Results",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        ...returnToRequiredDashboard,
        to: "LTSS-1",
      },
      {
        ...measureHeader,
        text: "Fee-For-Service Measure Results",
      },
      measureInstructions,
      measureDetailsSection,
      measureInformationSubheader,
      {
        type: ElementType.TextAreaField,
        id: "measure-programs-text",
        label: "Which Medicaid HCBS programs are being reported? (optional)",
        helperText:
          "Please provide waiver, SPA or 1115 demonstration names and associated control numbers.",
      },
      additionalNotesField,
      {
        ...measureFooter,
        prevTo: "LTSS-1960",
        completeSection: true,
        clear: undefined,
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
};
