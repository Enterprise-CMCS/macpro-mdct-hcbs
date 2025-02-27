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
  {
    cmit: 1822,
    uid: "1822-4",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-4"]],
  },
  {
    cmit: 1822,
    uid: "1822-5",
    required: true,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-5"]],
  },
  {
    cmit: 1822,
    uid: "1822-6",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-6"]],
  },
  {
    cmit: 1822,
    uid: "1822-7",
    required: false,
    stratified: false,
    measureTemplate: [MeasureTemplateName["POM-7"]],
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
        type: ElementType.ReportingRadio,
        label: "Is the state reporting on this measure?",
        id: "measure-reporting-radio",
        value: [
          {
            label: "Yes, the state is reporting on this measure",
            value: "yes",
          },
          {
            label: "No, CMS is reporting this measure on the state's behalf",
            value: "no",
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
  [MeasureTemplateName["POM-3"]]: {
    id: "POM-3",
    title: "POM: People Choose Services",
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
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
  [MeasureTemplateName["POM-4"]]: {
    id: "POM-4",
    title: "POM: People Realize Personal Goalss",
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
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
  [MeasureTemplateName["POM-5"]]: {
    id: "POM-5",
    title: "POM: People are Free from Abuse and Neglect",
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
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
  [MeasureTemplateName["POM-6"]]: {
    id: "POM-6",
    title: "POM: People Have the Best Possible Health",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        label: "Return to Optional Measures Dashboard",
        id: "return-button",
        to: "optional-measure-result",
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
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
  [MeasureTemplateName["POM-7"]]: {
    id: "POM-7",
    title: "POM: People Interact with Other Members of the Community",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        label: "Return to Optional Measures Dashboard",
        id: "return-button",
        to: "optional-measure-result",
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
        id: "measure-audited-radio",
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
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.Radio,
        id: "delivery-method-radio",
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
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "req-measure-result",
        completeMeasure: true,
        clear: true,
      },
    ],
  },
} as Record<MeasureTemplateName, MeasurePageTemplate>;
