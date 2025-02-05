import {
  ReportTemplate,
  PageType,
  ElementType,
  ReportType,
  MeasureTemplateName,
  MeasurePageTemplate,
} from "../types/reports";
import { DeliverySystem } from "../utils/constants";

export const qmsReportTemplate: ReportTemplate = {
  type: ReportType.QMS,
  title: "plan id",
  year: 2026,
  options: {},
  pages: [
    {
      id: "root",
      childPageIds: [
        "general-info",
        "req-measure-result",
        "optional-measure-result",
        "review-submit",
      ],
    },
    {
      id: "general-info",
      title: "General Information",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.Textbox,
          label: "Contact name",
          helperText:
            "Enter person's name or a position title for CMS to contact with questions about this report.",
        },
        {
          type: ElementType.Textbox,
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
      ],
    },
    {
      id: "req-measure-result",
      title: "Required Measure Results",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Required Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          measureDisplay: "required",
        },
      ],
    },
    {
      id: "req-measure-result-modal",
      title: "Select measure",
      sidebar: true,
      type: PageType.Modal,
      elements: [
        {
          type: ElementType.Header,
          text: "Select measure",
        },
        {
          type: ElementType.Paragraph,
          text: "Select the correct version of the quality measure.",
        },
        {
          type: ElementType.Radio,
          label: "Which quality measure will be reported?",
          value: [
            {
              label: "{Measure name version 1}",
              value: "measure-1",
            },
            {
              label: "{Measure name version 2}",
              value: "measure-2",
            },
          ],
        },
      ],
    },
    {
      id: "optional-measure-result",
      title: "Optional Measure Results",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Optional Measure Results",
        },
        {
          type: ElementType.Accordion,
          label: "Instructions",
          value: "I am an accordion",
        },
        {
          type: ElementType.MeasureTable,
          measureDisplay: "optional",
        },
      ],
    },
    {
      id: "review-submit",
      title: "Review & Submit",
      type: PageType.Standard,
      sidebar: true,
      hideNavButtons: true,
      elements: [
        {
          type: ElementType.Header,
          text: "Review & Submit",
        },
        {
          type: ElementType.Paragraph,
          title: "Ready to Submit?",
          text: "Double check that everything in your QMS Report is accurate. You will be able to make edits after submitting if you contact your [CMS representative] to unlock your report while it is in “Submitted” status.",
        },
        {
          type: ElementType.Paragraph,
          title: "Compliance review",
          text: "Your Project Officer will review your report and may contact you and unlock your report for editing if there are corrections to be made.",
        },
        {
          type: ElementType.StatusTable,
          to: "review-submit",
        },
      ],
    },
  ],
  measureLookup: {
    // TODO: what is a default measure and are there any other kinds of measures?
    defaultMeasures: [
      // required measures
      {
        cmit: 960,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-1"],
      },
      {
        cmit: 961,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-2"],
      },
      {
        cmit: 20,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-6"],
      },
      {
        cmit: 968,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-7"],
      },
      {
        cmit: 414,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-8"],
      },
      // optional measures
      {
        cmit: 969,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["FASI-1"],
      },
      {
        cmit: 970,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["FASI-2"],
      },
      {
        cmit: 111,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["HCBS-10"],
      },
      {
        cmit: 963,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-3"],
      },
      {
        cmit: 962,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-4"],
      },
      {
        cmit: 1255,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["LTSS-5"],
      },
      {
        cmit: 561,
        required: false,
        stratified: false,
        measureTemplate: MeasureTemplateName["MLTSS"],
      },
      // pom measures
      {
        cmit: 1822,
        required: true,
        stratified: false,
        measureTemplate: MeasureTemplateName["POM-1"],
      },
    ],
  },
  measureTemplates: {
    [MeasureTemplateName["LTSS-1"]]: {
      id: "LTSS-1",
      title: "LTSS-1: Comprehensive Assessment and Update",
      type: PageType.Measure,
      substitutable: true,
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "What Technical Specifications are you using to report this measure?",
          value: [
            { label: "CMS", value: "cms" },
            { label: "HEDIS", value: "hedis" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["LTSS-2"]]: {
      id: "LTSS-2",
      title: "LTSS-2: Comprehensive Person-Centered Plan and Update",
      type: PageType.Measure,
      sidebar: false,
      substitutable: true,
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "What Technical Specifications are you using to report this measure?",
          value: [
            { label: "CMS", value: "cms" },
            { label: "HEDIS", value: "hedis" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          type: ElementType.Radio,
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          type: ElementType.Radio,
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          type: ElementType.Radio,
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    //optional
    [MeasureTemplateName["FASI-1"]]: {
      id: "FASI-1",
      title: "FASI-1: Identification of Person-Centered Priorities",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "Did you follow from the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["FASI-2"]]: {
      id: "FASI-2",
      title: "FASI-2: Documentation of a Person-Centered Service Plan",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "Did you follow from the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "Did you follow from the [reportYear] Technical Specifications?",
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
          type: ElementType.SubHeader,
          text: "Quality Measures",
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "What Technical Specifications are you using to report this measure?",
          value: [
            { label: "CMS", value: "cms" },
            { label: "HEDIS", value: "hedis" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label:
            "What Technical Specifications are you using to report this measure?",
          value: [
            { label: "CMS", value: "cms" },
            { label: "HEDIS", value: "hedis" },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          formKey: "delivery-method-radio",
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
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
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
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          type: ElementType.SubHeader,
          text: "Quality Measures",
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["MLTSS"]]: {
      id: "MLTSS",
      title: "MLTSS: Plan All-Cause Readmission",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Optional Measures Dashboard",
          to: "optional-measure-result",
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
          label: "Were the reported measure results audited or validated?",
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
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Did you follow the [reportYear] Technical Specifications?",
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
          type: ElementType.SubHeader,
          text: "Quality Measures",
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["POM-1"]]: {
      id: "POM-1",
      title: "POM: People live in integrated environments",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Optional Measures Dashboard",
          to: "required-measure-result",
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
          // TO-DO: Import year how?
          label: "Did you follow the 2026 Technical Specifications?",
          value: [
            { label: "Yes", value: "yes" },
            {
              label: "No",
              value: "no",
              checkedChildren: [
                {
                  type: ElementType.Textbox,
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
                  type: ElementType.Textbox,
                  label:
                    "Enter the name of the entity that conducted the audit or validation.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Textbox,
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
  } as Record<MeasureTemplateName, MeasurePageTemplate>,
};
