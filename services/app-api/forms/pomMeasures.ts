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
    measureTemplate: [MeasureTemplateName["POM-1"]],
  },
  {
    cmit: 1822,
    uid: "1822-2",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-2"]],
  },
  {
    cmit: 1822,
    uid: "1822-3",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-3"]],
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
        label: "Return to Required Measures Dashboard",
        to: "req-measure-result",
      },
      {
        type: ElementType.Header,
        text: "{measureName}",
      },
      {
        type: ElementType.Accordion,
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      {
        type: ElementType.SubHeader,
        text: "Measure Details",
      },
      {
        type: ElementType.Radio,
        label: "Did you follow the 2026 Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
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
        text: "Quality Measures",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
      },
    ],
  },
  [MeasureTemplateName["POM-2"]]: {
    id: "POM-2",
    title: "POM: People Participate in the Life of the Community",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        label: "Return to Required Measures Dashboard",
        to: "req-measure-result",
      },
      {
        type: ElementType.Header,
        text: "{measureName}",
      },
      {
        type: ElementType.Accordion,
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      {
        type: ElementType.SubHeader,
        text: "Measure Details",
      },
      {
        type: ElementType.Radio,
        label: "Did you follow the 2026 Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
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
        text: "Quality Measures",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
      },
    ],
  },
  [MeasureTemplateName["POM-3"]]: {
    id: "POM-2",
    title: "POM: People Choose Services",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        label: "Return to Required Measures Dashboard",
        to: "req-measure-result",
      },
      {
        type: ElementType.Header,
        text: "{measureName}",
      },
      {
        type: ElementType.Accordion,
        label: "Instructions",
        value:
          "[Optional instructional content that could support the user in completing this page]",
      },
      {
        type: ElementType.SubHeader,
        text: "Measure Details",
      },
      {
        type: ElementType.Radio,
        label: "Did you follow the 2026 Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
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
        text: "Quality Measures",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
      },
    ],
  },
} as Record<MeasureTemplateName, MeasurePageTemplate>;
