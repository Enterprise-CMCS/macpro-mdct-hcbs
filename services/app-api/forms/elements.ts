import {
  AccordionTemplate,
  ButtonLinkTemplate,
  ElementType,
  HeaderTemplate,
  MeasureDetailsTemplate,
  MeasureFooterTemplate,
  QualityMeasureTableTemplate,
  RadioTemplate,
  ReportingRadioTemplate,
  SubHeaderTemplate,
  TextAreaBoxTemplate,
} from "../types/reports";

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
};

export const doYouWantCmsToCalculateOnYourBehalf: RadioTemplate = {
  type: ElementType.Radio,
  id: "measure-cms-calculate",
  label: "Do you want CMS to calculate this measure on your behalf?",
  value: [
    { label: "No", value: "no" },
    { label: "Yes", value: "yes" },
  ],
};

export const additionalNotesField: TextAreaBoxTemplate = {
  type: ElementType.TextAreaField,
  id: "additional-notes-field",
  helperText:
    "If applicable, add any notes or comments to provide context to the reported measure result",
  label: "Additional notes/comments (optional)",
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
};

export const qualityMeasuresSubheader: SubHeaderTemplate = {
  type: ElementType.SubHeader,
  text: "Quality Measures",
  id: "quality-measures-subheader",
};

export const qualityMeasureTable: QualityMeasureTableTemplate = {
  type: ElementType.QualityMeasureTable,
  measureDisplay: "quality",
  id: "quality-measure-table",
};

export const measureFooter: MeasureFooterTemplate = {
  type: ElementType.MeasureFooter,
  id: "measure-footer",
  prevTo: "req-measure-result",
  completeMeasure: true,
  clear: true,
};
