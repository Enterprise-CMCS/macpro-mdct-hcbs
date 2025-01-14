import { qmReportTemplate } from "../../forms/qm";
import {
  Report,
  PageType,
  ElementType,
  MeasureTemplateName,
  MeasurePageTemplate,
  ReportStatus,
} from "../../types/reports";

export const validReport: Report = {
  ...qmReportTemplate,
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

export const missingStateReport = {
  ...qmReportTemplate,
  // missing state
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

export const incorrectStatusReport = {
  ...qmReportTemplate,
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: "wrong value", // Doesn't use ReportStatus enum
  name: "yeehaw",
};

export const incorrectTypeReport = {
  ...qmReportTemplate,
  type: "wrong type", // Doesn't use ReportType enum
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.IN_PROGRESS,
  name: "yeehaw",
};

export const invalidMeasureTemplatesReport = {
  ...qmReportTemplate,
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
          //   type: ElementType.Header,
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
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
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
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
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
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
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
                  label: "Please explain the variance.",
                },
              ],
            },
          ],
        },
        {
          type: ElementType.Radio,
          label: "Which delivery systems were used to report this measure?",
          value: [
            { label: "Fee-For-Service (FFS)", value: "fee-for-service" },
            {
              label: "Managed Long-Term Services and Supports (MLTSS)",
              value: "managed-long-term-services-and-supports",
            },
            {
              label: "Both FFS and MLTSS (separate)",
              value: "both-ffs-and-mltss",
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
                  type: ElementType.Textbox,
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
  } as Record<MeasureTemplateName, MeasurePageTemplate>,
  state: "OH",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

export const invalidMeasureLookupReport = {
  ...qmReportTemplate,
  measureLookup: {
    defaultMeasures: [
      {
        cmit: 960,
        required: true,
        stratified: false,
        measureTemplate: "hi", // not a MeasureTemplate enum value
      },
    ],
  },
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

export const invalidFormPageReport = {
  ...qmReportTemplate,
  pages: [
    {
      id: "general-info",
      // missing title field
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          text: "General Information",
        },
        {
          type: ElementType.SubHeader,
          text: "State of Program Information",
        },
        {
          type: ElementType.Textbox,
          label: "Contact title",
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          label: "Contact email address",
          helperText:
            "Enter email address. Department or program-wide email addresses ok.",
        },
        {
          type: ElementType.Date,
          label: "Reporting period start date",
          helperText:
            "What is the reporting period Start Date applicable to the measure results?",
        },
        {
          type: ElementType.Date,
          label: "Reporting period end date",
          helperText:
            "What is the reporting period End Date applicable to the measure results?",
        },
      ],
    },
  ],
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};

export const invalidParentPageReport = {
  ...qmReportTemplate,
  pages: [
    {
      // missing id field
      childPageIds: [
        "general-info",
        "req-measure-result",
        "optional-measure-result",
        "review-submit",
      ],
    },
  ],
  state: "NJ",
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  created: 1736524513631,
  lastEdited: 1736524513631,
  lastEditedBy: "Anthony Soprano",
  lastEditedByEmail: "stateuser2@test.com",
  status: ReportStatus.NOT_STARTED,
  name: "yeehaw",
};
