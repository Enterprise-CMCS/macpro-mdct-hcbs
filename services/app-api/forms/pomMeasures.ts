import {
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
  MeasureOptions,
} from "../types/reports";
import { DeliverySystem } from "../utils/constants";

export const pomMeasures: MeasureOptions[] = [
  {
    cmit: 1822,
    uid: "1822-1",
    required: true,
    stratified: false,
    measureTemplate: MeasureTemplateName["POM-1"],
  },
];

export const pomMeasureTemplates = {
  [MeasureTemplateName["POM-1"]]: {
    id: "POM-1",
    title: "POM: People Live in Integrated Environments",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Required Measures Dashboard",
        to: "req-measure-result",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "{measureName}",
      },
      {
        type: ElementType.Accordion,
        id: "measure-instructions",
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      {
        type: ElementType.SubHeader,
        id: "measure-details-subheader",
        text: "Measure Details",
      },
      {
        type: ElementType.Radio,
        id: "measure-reporting-radio",
        label: "Did you follow the 2026 Technical Specifications?",
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
      },
      {
        type: ElementType.Radio,
        id: "measure-reporting-radio",
        label: "Were the reported measure results audited or validated?",
        value: [
          { label: "No", value: "no" },
          {
            label: "Yes",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                label:
                  "Enter the name of the entity that conducted the audit or validation.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.TextAreaField,
        id: "measure-context-text",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additonal notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        formKey: "delivery-method-radio",
        label: "Which delivery systems were used to report this measure?",
        value: [
          { label: "Fee-for-Service (FFS)", value: DeliverySystem.FFS },
          {
            label: "Managed Long-Term Services and Supports (MLTSS)",
            value: DeliverySystem.MLTSS,
          },
          {
            label: "Both FFS and MLTSS (separate)",
            value: [DeliverySystem.FFS, DeliverySystem.MLTSS].join(","),
          },
        ],
      },
      {
        type: ElementType.SubHeader,
        id: "quality-measures-subheader",
        text: "Quality Measures",
      },
      {
        type: ElementType.QualityMeasureTable,
        id: "quality-measure-table",
        measureDisplay: "quality",
      },
    ],
  },
} as Record<MeasureTemplateName, MeasurePageTemplate>;
