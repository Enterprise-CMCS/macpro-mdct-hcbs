import { array, boolean, lazy, mixed, number, object, string } from "yup";
import {
  ReportStatus,
  ReportType,
  MeasureTemplateName,
  PageType,
  ElementType,
  PageElement,
} from "../types/reports";
import { error } from "./constants";

const headerTemplateSchema = object().shape({
  type: string().required(ElementType.Header),
  text: string().required(),
});

const subHeaderTemplateSchema = object().shape({
  type: string().required(ElementType.SubHeader),
  text: string().required(),
});

const paragraphTemplateSchema = object().shape({
  type: string().required(ElementType.Paragraph),
  text: string().required(),
  title: string().notRequired(),
});

const textboxTemplateSchema = object().shape({
  type: string().required(ElementType.Textbox),
  label: string().required(),
  helperText: string().notRequired(),
});

const dateTemplateSchema = object().shape({
  type: string().required(ElementType.Date),
  label: string().required(),
  helperText: string().required(),
});

const accordionTemplateSchema = object().shape({
  type: string().required(ElementType.Accordion),
  label: string().required(),
  value: string().required(),
});

const resultRowButtonTemplateSchema = object().shape({
  type: string().required(ElementType.ResultRowButton),
  value: string().required(),
  modalId: string().required(),
  to: string().required(),
});

const radioTemplateSchema = object().shape({
  type: string().required(ElementType.Radio),
  label: string().required(),
  helperText: string().notRequired(),
  value: array().of(
    object().shape({
      label: string().required(),
      value: string().required(),
      checked: boolean().notRequired(),
      checkedChildren: array().notRequired(), // TODO: add PageElement array
    })
  ),
});

const buttonLinkTemplateSchema = object().shape({
  type: string().required(ElementType.ButtonLink),
  label: string().required(),
  to: string().required(),
});

const measureTableTemplateSchema = object().shape({
  type: string().required(ElementType.MeasureTable),
  measureDisplay: string()
    .oneOf(["required", "stratified", "optional"])
    .required(),
});

const qualityMeasureTableTemplateSchema = object().shape({
  type: string().required(ElementType.QualityMeasureTable),
  measureDisplay: string().required("quality"),
});

const statusTableTemplateSchema = object().shape({
  type: string().required(ElementType.StatusTable),
  to: string().required(),
});

const pageElementSchema = lazy((value: PageElement) => {
  if (!value.type) {
    throw new Error();
  }
  switch (value.type) {
    case ElementType.Header:
      return headerTemplateSchema;
    case ElementType.SubHeader:
      return subHeaderTemplateSchema;
    case ElementType.Paragraph:
      return paragraphTemplateSchema;
    case ElementType.Textbox:
      return textboxTemplateSchema;
    case ElementType.Date:
      return dateTemplateSchema;
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
    case ElementType.QualityMeasureTable:
      return qualityMeasureTableTemplateSchema;
    case ElementType.StatusTable:
      return statusTableTemplateSchema;
    default:
      return mixed().notRequired(); // Fallback, although it should never be hit
  }
});

const parentPageTemplateSchema = object().shape({
  id: string().required(),
  childPageIds: array().of(string()).required(),
});

const formPageTemplateSchema = object().shape({
  id: string().required(),
  title: string().required(),
  type: mixed<PageType>().oneOf(Object.values(PageType)).required(),
  elements: array().of(pageElementSchema).required(),
  sidebar: boolean().notRequired(),
  hideNavButtons: boolean().notRequired(),
  childPageIds: array().of(string()).notRequired(),
});

// MeasurePageTemplate extends FormPageTemplate
const measurePageTemplateSchema = formPageTemplateSchema.shape({
  cmit: number().notRequired(),
  required: boolean().notRequired(),
  stratified: boolean().notRequired(),
  optional: boolean().notRequired(),
  substitutable: boolean().notRequired(),
});

const measureLookupSchema = object().shape({
  defaultMeasures: array().of(
    object().shape({
      cmit: number().required(),
      required: boolean().required(),
      stratified: boolean().required(),
      measureTemplate: mixed()
        .oneOf(Object.values(MeasureTemplateName))
        .required(),
    })
  ),
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
        if (pageObject.type == PageType.Measure) {
          return measurePageTemplateSchema;
        }
        return formPageTemplateSchema;
      }
    })
  )
  .required();

/**
 * This schema represents a typescript type of Record<MeasureTemplateName, MeasurePageTemplate>
 *
 * The following code is looping through the MeasureTemplateName enum and building
 * a yup validation object that looks like so:
 * {
 *   [MeasureTemplateName["LTSS-1"]]: measurePageTemplateSchema,
 *   [MeasureTemplateName["LTSS-2"]]: measurePageTemplateSchema,
 *   [MeasureTemplateName["LTSS-6"]]: measurePageTemplateSchema,
 *   ...
 *   ...
 *  }
 */

// const measureTemplatesSchema = object().shape(
//   Object.fromEntries(
//     Object.keys(MeasureTemplateName).map((meas) => [
//       meas,
//       measurePageTemplateSchema,
//     ])
//   )
// );

const measureTemplatesSchema = object().shape({
  [MeasureTemplateName["LTSS-1"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-2"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-6"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-7"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-8"]]: measurePageTemplateSchema,
  [MeasureTemplateName["FASI-1"]]: measurePageTemplateSchema,
  [MeasureTemplateName["FASI-2"]]: measurePageTemplateSchema,
  [MeasureTemplateName["HCBS-10"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-3"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-4"]]: measurePageTemplateSchema,
  [MeasureTemplateName["LTSS-5"]]: measurePageTemplateSchema,
});

const reportValidateSchema = object().shape({
  id: string().notRequired(),
  state: string().required(),
  created: number().notRequired(),
  lastEdited: number().notRequired(),
  lastEditedBy: string().required(),
  lastEditedByEmail: string().required(),
  status: mixed<ReportStatus>().oneOf(Object.values(ReportStatus)).required(),
  name: string().notRequired(),
  type: mixed<ReportType>().oneOf(Object.values(ReportType)).required(),
  title: string().required(),
  pages: pagesSchema,
  measureLookup: measureLookupSchema,
  measureTemplates: measureTemplatesSchema,
});

export const validateUpdateReportPayload = async (
  payload: object | undefined
) => {
  if (!payload) {
    throw new Error(error.MISSING_DATA);
  }

  const validatedPayload = await reportValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload;
};
