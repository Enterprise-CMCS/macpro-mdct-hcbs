import {
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
  MeasureOptions,
} from "../types/reports";

import { DeliverySystem } from "../utils/constants";

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

export const defaultMeasureTemplates = {
  [MeasureTemplateName["LTSS-1"]]: {
    id: "LTSS-1",
    title: "LTSS-1: Comprehensive Assessment and Update",
    type: PageType.Measure,
    substitutable: MeasureTemplateName["FASI-1"],
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Required Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        label:
          "What Technical Specifications are you using to report this measure?",
        id: "measure-tech-specs-radio",
        value: [
          { label: "CMS", value: "cms" },
          { label: "HEDIS", value: "hedis" },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
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
  [MeasureTemplateName["FFS-1"]]: {
    id: "FFS-1",
    title: "LTSS-1: FFS LTSS Measure Results",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Required Measures Dashboard",
        to: "LTSS-1",
      },
      {
        type: ElementType.Header,
        id: "measure-header",
        text: "Fee-For-Service Measure Results",
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
        text: "FSS LTSS Measure Details",
      },
      {
        type: ElementType.TextAreaField,
        id: "measure-programs-text",
        label: "Which Medicaid HCBS programs are being reported? (optional)",
        helperText:
          "Please provide waiver, SPA or 1115 demonstration names and associated control numbers.",
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
      {
        type: ElementType.MeasureFooter,
        id: "measure-footer",
        prevTo: "LTSS-1960",
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
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Required Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        label:
          "What Technical Specifications are you using to report this measure?",
        id: "measure-tech-specs-radio",
        value: [
          { label: "CMS", value: "cms" },
          { label: "HEDIS", value: "hedis" },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
    ],
  },
  [MeasureTemplateName["LTSS-6"]]: {
    id: "LTSS-6",
    title: "LTSS-6: Admission to a Facility from the Community",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-cms-calculate",
        label: "Do you want CMS to calculate this measure on your behalf?",
        value: [
          { label: "No", value: "no" },
          {
            label: "Yes",
            value: "yes",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
    ],
  },
  [MeasureTemplateName["LTSS-7"]]: {
    id: "LTSS-7",
    title: "LTSS-7: Minimizing Facility Length of Stay",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-cms-calculate",
        label: "Do you want CMS to calculate this measure on your behalf?",
        value: [
          { label: "No", value: "no" },
          {
            label: "Yes",
            value: "yes",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
    ],
  },
  [MeasureTemplateName["LTSS-8"]]: {
    id: "LTSS-8",
    title: "LTSS-8: Successful Transition after Long-Term Facility Stay",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-cms-calculate",
        label: "Do you want CMS to calculate this measure on your behalf?",
        value: [
          { label: "No", value: "no" },
          {
            label: "Yes",
            value: "yes",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
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
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-following-tech-specs",
        label: "Did you follow from the [reportYear] Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
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
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-following-tech-specs",
        label: "Did you follow from the [reportYear] Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
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
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        id: "measure-following-tech-specs",
        label: "Did you follow from the [reportYear] Technical Specifications?",
        value: [
          { label: "Yes", value: "yes" },
          {
            label: "No",
            value: "no",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
        type: ElementType.SubHeader,
        text: "Quality Measures",
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
    ],
  },
  [MeasureTemplateName["LTSS-3"]]: {
    id: "LTSS-3",
    title: "LTSS-3: Shared Person-Centered Plan with Primary Care Provider",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        label:
          "What Technical Specifications are you using to report this measure?",
        id: "measure-tech-specs-radio",
        value: [
          { label: "CMS", value: "cms" },
          { label: "HEDIS", value: "hedis" },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
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
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.Radio,
        label:
          "What Technical Specifications are you using to report this measure?",
        id: "measure-tech-specs-radio",
        value: [
          { label: "CMS", value: "cms" },
          { label: "HEDIS", value: "hedis" },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
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
          { label: "Fee-For-Service (FFS)", value: DeliverySystem.FFS },
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
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
    ],
  },
  [MeasureTemplateName["LTSS-5"]]: {
    id: "LTSS-5",
    title:
      "LTSS-5: Screening, Risk Assessment, and Plan of Care to Prevent Future Falls",
    type: PageType.Measure,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.SubHeader,
        text: "Quality Measures",
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
    ],
  },
  [MeasureTemplateName["MLTSS"]]: {
    id: "MLTSS",
    title: "MLTSS: Plan All-Cause Readmission",
    type: PageType.MeasureResults,
    sidebar: false,
    elements: [
      {
        type: ElementType.ButtonLink,
        id: "return-button",
        label: "Return to Optional Measures Dashboard",
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
        label: "Were the reported measure results audited or validated?",
        id: "measure-audited-radio",
        value: [
          { label: "No, I am reporting on this measure", value: "no" },
          {
            label: "Yes, CMS is reporting on my behalf",
            value: "yes",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                label:
                  "What is the name of the agency or entity that audited or validated the report?",
                id: "measure-auditing-agency",
              },
            ],
          },
        ],
      },
      {
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
                type: ElementType.Textbox,
                id: "measure-following-tech-specs-no-explain",
                label: "Please explain the variance.",
              },
            ],
          },
        ],
      },
      {
        type: ElementType.SubHeader,
        text: "Quality Measures",
        id: "quality-measures-subheader",
      },
      {
        type: ElementType.QualityMeasureTable,
        measureDisplay: "quality",
        id: "quality-measure-table",
      },
      {
        type: ElementType.TextAreaField,
        id: "additional-notes-field",
        helperText:
          "If applicable, add any notes or comments to provide context to the reported measure result",
        label: "Additional notes/comments (optional)",
      },
    ],
  },
} as Record<MeasureTemplateName, MeasurePageTemplate>;
