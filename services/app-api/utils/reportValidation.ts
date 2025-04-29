import {
  array,
  boolean,
  lazy,
  mixed,
  number,
  object,
  Schema,
  string,
} from "yup";
import {
  Report,
  ReportStatus,
  ReportType,
  PageType,
  ElementType,
  PageElement,
} from "../types/reports";
import { error } from "./constants";

const hideConditionSchema = object()
  .shape({
    controllerElementId: string().required(),
    answer: string().required(),
  })
  .notRequired()
  .default(undefined);

const headerTemplateSchema = object().shape({
  type: string().required(ElementType.Header),
  id: string().required(),
  text: string().required(),
  icon: string().notRequired(),
});

const subHeaderTemplateSchema = object().shape({
  type: string().required(ElementType.SubHeader),
  id: string().required(),
  text: string().required(),
  helperText: string().notRequired(),
  hideCondition: hideConditionSchema,
});

const subHeaderMeasureSchema = object().shape({
  type: string().required(ElementType.SubHeaderMeasure),
  id: string().required(),
});

const nestedHeadingTemplateSchema = object().shape({
  type: string().required(ElementType.NestedHeading),
  id: string().required(),
  text: string().required(),
});

const paragraphTemplateSchema = object().shape({
  type: string().required(ElementType.Paragraph),
  id: string().required(),
  text: string().required(),
  title: string().notRequired(),
  weight: string().notRequired(),
});

const textboxTemplateSchema = object().shape({
  type: string().required(ElementType.Textbox),
  id: string().required(),
  label: string().required(),
  helperText: string().notRequired(),
  answer: string().notRequired(),
  required: boolean().notRequired(),
  hideCondition: hideConditionSchema,
});

const textAreaTemplateSchema = object().shape({
  type: string().required(ElementType.Textbox),
  id: string().required(),
  label: string().required(),
  helperText: string().notRequired(),
  answer: string().notRequired(),
  hideCondition: hideConditionSchema,
  required: boolean().notRequired(),
});

const dateTemplateSchema = object().shape({
  type: string().required(ElementType.Date),
  id: string().required(),
  label: string().required(),
  helperText: string().required(),
  answer: string().notRequired(),
});

const dropdownTemplateSchema = object().shape({
  type: string().required(ElementType.Dropdown),
  id: string().required(),
  label: string().required(),
  helperText: string().required(),
  options: array().of(
    object().shape({
      label: string().required(),
      value: string().required(),
      checked: boolean().notRequired(),
      checkedChildren: lazy(() => array().of(pageElementSchema).notRequired()),
    })
  ),
  answer: string().notRequired(),
  required: boolean().notRequired(),
});

const accordionTemplateSchema = object().shape({
  type: string().required(ElementType.Accordion),
  id: string().required(),
  label: string().required(),
  value: string().required(),
});

const resultRowButtonTemplateSchema = object().shape({
  type: string().required(ElementType.ResultRowButton),
  id: string().required(),
  value: string().required(),
  modalId: string().required(),
  to: string().required(),
});

const pageElementSchema = lazy((value: PageElement): Schema<any> => {
  if (!value.type) {
    throw new Error();
  }
  switch (value.type) {
    case ElementType.Header:
      return headerTemplateSchema;
    case ElementType.SubHeader:
      return subHeaderTemplateSchema;
    case ElementType.SubHeaderMeasure:
      return subHeaderMeasureSchema;
    case ElementType.NestedHeading:
      return nestedHeadingTemplateSchema;
    case ElementType.Paragraph:
      return paragraphTemplateSchema;
    case ElementType.Textbox:
      return textboxTemplateSchema;
    case ElementType.TextAreaField:
      return textAreaTemplateSchema;
    case ElementType.Date:
      return dateTemplateSchema;
    case ElementType.Dropdown:
      return dropdownTemplateSchema;
    case ElementType.Accordion:
      return accordionTemplateSchema;
    case ElementType.ResultRowButton:
      return resultRowButtonTemplateSchema;
    case ElementType.Radio:
      return radioTemplateSchema;
    case ElementType.ButtonLink:
      return buttonLinkTemplateSchema;
    case ElementType.MeasureTable:
      return measureTableTemplateSchema;
    case ElementType.MeasureResultsNavigationTable:
      return measureResultsNavigationTableTemplateSchema;
    case ElementType.StatusTable:
      return statusTableTemplateSchema;
    case ElementType.MeasureDetails:
      return measureDetailsTemplateSchema;
    case ElementType.MeasureFooter:
      return measureFooterSchema;
    case ElementType.PerformanceRate:
      return performanceRateSchema;
    case ElementType.StatusAlert:
      return statusAlertSchema;
    case ElementType.Divider:
      return dividerSchema;
    case ElementType.SubmissionParagraph:
      return submissionParagraphSchema;
    default:
      throw new Error("Page Element type is not valid");
  }
});

const radioTemplateSchema = object().shape({
  type: string().required(ElementType.Radio),
  id: string().required(),
  label: string().required(),
  helperText: string().notRequired(),
  value: array().of(
    object().shape({
      label: string().required(),
      value: string().required(),
      checked: boolean().notRequired(),
      checkedChildren: lazy(() => array().of(pageElementSchema).notRequired()),
    })
  ),
  answer: string().notRequired(),
  required: boolean().notRequired(),
  clickAction: string().notRequired(),
  hideCondition: hideConditionSchema,
});

const buttonLinkTemplateSchema = object().shape({
  type: string().required(ElementType.ButtonLink),
  id: string().required(),
  label: string().optional(),
  to: string().optional(),
});

const dividerSchema = object().shape({
  type: string().required(ElementType.Divider),
  id: string().required(),
});

const submissionParagraphSchema = object().shape({
  type: string().required(ElementType.SubmissionParagraph),
  id: string().required(),
});

const measureTableTemplateSchema = object().shape({
  type: string().required(ElementType.MeasureTable),
  id: string().required(),
  measureDisplay: string()
    .oneOf(["required", "stratified", "optional"])
    .required(),
});

const measureResultsNavigationTableTemplateSchema = object().shape({
  type: string().required(ElementType.MeasureResultsNavigationTable),
  id: string().required(),
  measureDisplay: string().required("quality"),
  hideCondition: object()
    .shape({
      controllerElementId: string().required(),
      answer: string().required(),
    })
    .notRequired()
    .default(undefined),
});

const statusTableTemplateSchema = object().shape({
  type: string().required(ElementType.StatusTable),
  id: string().required(),
  to: string().required(),
});

const measureDetailsTemplateSchema = object().shape({
  type: string().required(ElementType.MeasureDetails),
  id: string().required(),
});

const measureFooterSchema = object().shape({
  type: string().required(ElementType.MeasureFooter),
  id: string().required(),
  prevTo: string().notRequired(),
  nextTo: string().notRequired(),
  completeMeasure: boolean().notRequired(),
  completeSection: boolean().notRequired(),
  clear: boolean().notRequired(),
});

const performanceRateSchema = object().shape({
  type: string().required(ElementType.PerformanceRate),
  id: string().required(),
  label: string().notRequired(),
  helperText: string().notRequired(),
  assessments: array()
    .of(
      object().shape({
        id: string().required(),
        label: string().required(),
      })
    )
    .notRequired(),
  fields: array()
    .of(
      object().shape({
        id: string().required(),
        label: string().required(),
        autoCalc: boolean().notRequired(),
      })
    )
    .notRequired(),
  required: boolean().notRequired(),
  rateType: string().required(),
  rateCalc: string().notRequired(),
  multiplier: number().notRequired(),
  answer: mixed().notRequired(),
});

const parentPageTemplateSchema = object().shape({
  id: string().required(),
  childPageIds: array().of(string()).required(),
});

const statusAlertSchema = object().shape({
  type: string().required(ElementType.StatusAlert),
  id: string().required(),
  title: string().notRequired(),
  text: string().required(),
  status: string().required(),
});

const formPageTemplateSchema = object().shape({
  id: string().required(),
  title: string().required(),
  type: mixed<PageType>().oneOf(Object.values(PageType)).required(),
  status: string().notRequired(),
  elements: array().of(pageElementSchema).required(),
  sidebar: boolean().notRequired(),
  hideNavButtons: boolean().notRequired(),
  childPageIds: array().of(string()).notRequired(),
});

const cmitInfoSchema = object().shape({
  cmit: number().required(),
  name: string().required(),
  uid: string().required(),
  measureSteward: string().required(),
  measureSpecification: array().of(string()).required(),
  deliverySystem: array().of(string()).notRequired(),
  dataSource: string().required(),
});

const dependentPageInfoSchema = object().shape({
  key: string().required(),
  linkText: string().required(),
  template: string().required(),
});

// MeasurePageTemplate extends FormPageTemplate
const measurePageTemplateSchema = formPageTemplateSchema.shape({
  cmit: number().notRequired(),
  cmitId: string().notRequired(),
  required: boolean().notRequired(),
  stratified: boolean().notRequired(),
  optional: boolean().notRequired(),
  substitutable: string().notRequired(),
  dependentPages: array()
    .of(dependentPageInfoSchema)
    .notRequired()
    .default(undefined),
  cmitInfo: cmitInfoSchema.notRequired().default(undefined),
});

const reviewSubmitTemplateSchema = formPageTemplateSchema.shape({
  submittedView: array().of(pageElementSchema).required(),
});

const optionsSchema = object().shape({
  cahps: boolean().notRequired(),
  hciidd: boolean().notRequired(),
  nciad: boolean().notRequired(),
  pom: boolean().notRequired(),
});

/**
 * This schema is meant to represent the pages field in the ReportTemplate type.
 * The following yup `lazy` function is building up the union type:
 * `(ParentPageTemplate | FormPageTemplate | MeasurePageTemplate)[]`
 * and outputs the correct type in the union based on various fields
 * on the page object that gets passed through.
 */
const pagesSchema = array()
  .of(
    lazy((pageObject) => {
      if (!pageObject.type) {
        if (pageObject.id && pageObject.childPageIds) {
          return parentPageTemplateSchema;
        } else {
          throw new Error();
        }
      } else {
        switch (pageObject.type) {
          case PageType.ReviewSubmit:
            return reviewSubmitTemplateSchema;
          case PageType.Measure:
            return measurePageTemplateSchema;
          case PageType.Standard:
          default:
            return formPageTemplateSchema;
        }
      }
    })
  )
  .required();

const reportValidateSchema = object().shape({
  id: string().notRequired(),
  state: string().required(),
  created: number().notRequired(),
  lastEdited: number().notRequired(),
  lastEditedBy: string().required(),
  lastEditedByEmail: string().notRequired(),
  submitted: number().notRequired(),
  submittedBy: string().notRequired(),
  submittedByEmail: string().notRequired(),
  status: mixed<ReportStatus>().oneOf(Object.values(ReportStatus)).required(),
  name: string().required(),
  type: mixed<ReportType>().oneOf(Object.values(ReportType)).required(),
  year: number().required(),
  submissionCount: number().required(),
  archived: boolean().required(),
  options: optionsSchema,
  pages: pagesSchema,
});

export const validateReportPayload = async (payload: object | undefined) => {
  if (!payload) {
    throw new Error(error.MISSING_DATA);
  }

  const validatedPayload = await reportValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload as Report;
};
