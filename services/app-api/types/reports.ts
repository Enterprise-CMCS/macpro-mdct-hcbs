// Templates

import {
  DataSource,
  DeliverySystem,
  MeasureSpecification,
} from "../utils/constants";

export enum ReportType {
  QMS = "QMS",
}
export const isReportType = (x: string | undefined): x is ReportType => {
  return Object.values(ReportType).includes(x as ReportType);
};

export interface ReportOptions {
  name?: string;
  year: number;
  options: {
    cahps?: boolean;
    hciidd?: boolean;
    nciad?: boolean;
    pom?: boolean;
  };
}

export interface CMIT {
  cmit: number;
  name: string;
  uid: string;
  options: string;
  deliverySystem: DeliverySystem[];
  measureSteward: string;
  measureSpecification: MeasureSpecification[];
  dataSource: DataSource;
}

export interface MeasureOptions {
  cmit: number;
  uid: string;
  required: boolean;
  stratified: boolean;
  measureTemplate: MeasureTemplateName[];
}

export enum MeasureTemplateName {
  // required measures
  "LTSS-1" = "LTSS-1",
  "FFS960" = "FFS960",
  "LTSS-2" = "LTSS-2",
  "LTSS-6" = "LTSS-6",
  "LTSS-7" = "LTSS-7",
  "LTSS-8" = "LTSS-8",
  // optional measures
  "FASI-1" = "FASI-1",
  "FASI-2" = "FASI-2",
  "HCBS-10" = "HCBS-10",
  "LTSS-3" = "LTSS-3",
  "LTSS-4" = "LTSS-4",
  "LTSS-5" = "LTSS-5",
  "MLTSS" = "MLTSS",
  // pom measures
  "POM-1" = "POM-1",
  "POM-2" = "POM-2",
}

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}

export enum MeasureStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  COMPLETE = "Complete",
}

export interface Report extends ReportTemplate {
  id?: string;
  state: string;
  created?: number;
  lastEdited?: number;
  lastEditedBy: string;
  lastEditedByEmail: string;
  status: ReportStatus;
}

export interface MeasurePageTemplate extends FormPageTemplate {
  cmit?: number;
  required?: boolean;
  stratified?: boolean;
  optional?: boolean;
  substitutable?: boolean;
  status: MeasureStatus;
}

export interface SectionTemplate {
  title: string;
  id: string;
  pageElements: PageElements[];
}

export interface FormComponent {
  id: string;
  type: string;
}

export interface Input extends FormComponent {
  type: "input";
  inputType: string;
  questionText: string;
  answer?: string | number;
}

export interface Text extends FormComponent {
  type: "text";
  text: string;
}

export type PageElements = Input | Text;

export interface Form {
  name: string;
  createdBy: string;
  sections: [];
}

export type ReportTemplate = ReportOptions & {
  type: ReportType;
  title: string;
  pages: (ParentPageTemplate | FormPageTemplate | MeasurePageTemplate)[];
  measureLookup: {
    defaultMeasures: MeasureOptions[];
    pomMeasures: MeasureOptions[];
  };
  measureTemplates: Record<MeasureTemplateName, MeasurePageTemplate>;
};

export type PageTemplate =
  | ParentPageTemplate
  | FormPageTemplate
  | MeasurePageTemplate;

export type ParentPageTemplate = {
  id: PageId;
  childPageIds: PageId[];
  title?: undefined;
  type?: undefined;
  elements?: undefined;
  sidebar?: undefined;
};
export const isParentPage = (
  page: PageTemplate
): page is ParentPageTemplate => {
  return "childPageIds" in page;
};

export type FormPageTemplate = {
  id: PageId;
  title: string;
  type: PageType;
  elements: PageElement[];
  sidebar?: boolean;
  hideNavButtons?: boolean;
  childPageIds?: PageId[];
};
export const isChildPage = (page: PageTemplate): page is FormPageTemplate => {
  return "elements" in page;
};

export type PageId = string;

export enum PageType {
  Standard = "standard",
  Modal = "modal",
  Measure = "measure",
  MeasureResults = "measureResults",
}

export enum ElementType {
  Header = "header",
  SubHeader = "subHeader",
  Textbox = "textbox",
  TextAreaField = "textAreaField",
  Date = "date",
  Accordion = "accordion",
  ResultRowButton = "resultRowButton",
  Paragraph = "paragraph",
  Radio = "radio",
  ReportingRadio = "reportingRadio",
  ButtonLink = "buttonLink",
  MeasureTable = "measureTable",
  QualityMeasureTable = "qualityMeasureTable",
  StatusTable = "statusTable",
  MeasureFooter = "measureFooter",
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | TextboxTemplate
  | TextAreaBoxTemplate
  | DateTemplate
  | AccordionTemplate
  | ResultRowButtonTemplate
  | ParagraphTemplate
  | RadioTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | QualityMeasureTableTemplate
  | StatusTableTemplate
  | MeasureFooterTemplate;

export type HeaderTemplate = {
  type: ElementType.Header;
  id: string;
  text: string;
};

export type SubHeaderTemplate = {
  type: ElementType.SubHeader;
  id: string;
  text: string;
};

export type ParagraphTemplate = {
  type: ElementType.Paragraph;
  id: string;
  title?: string;
  text: string;
};

export type TextboxTemplate = {
  type: ElementType.Textbox;
  id: string;
  label: string;
  helperText?: string;
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type TextAreaBoxTemplate = {
  type: ElementType.TextAreaField;
  id: string;
  label: string;
  helperText?: string;
  answer?: string;
};

export type DateTemplate = {
  type: ElementType.Date;
  id: string;
  label: string;
  helperText: string;
  answer?: string;
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  id: string;
  label: string;
  value: string;
};

export type ResultRowButtonTemplate = {
  type: ElementType.ResultRowButton;
  id: string;
  value: string;
  modalId: PageId;
  to: PageId;
};
export const isResultRowButton = (
  element: PageElement
): element is ResultRowButtonTemplate => {
  return element.type === ElementType.ResultRowButton;
};

export type RadioTemplate = {
  type: ElementType.Radio;
  id: string;
  formKey?: string;
  label: string;
  helperText?: string;
  value: ChoiceTemplate[];
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  id: string;
  label: string;
  to: PageId;
};

export type MeasureFooterTemplate = {
  type: ElementType.MeasureFooter;
  id: string;
  prevTo: string;
  nextTo?: string;
  completeMeasure?: boolean;
  completeSection?: boolean;
  clear?: boolean;
};

export type ChoiceTemplate = {
  label: string;
  value: string;
  checked?: boolean;
  checkedChildren?: PageElement[];
};

export type MeasureTableTemplate = {
  id: string;
  type: ElementType.MeasureTable;
  measureDisplay: "required" | "stratified" | "optional";
};

export type QualityMeasureTableTemplate = {
  type: ElementType.QualityMeasureTable;
  id: string;
  measureDisplay: "quality";
};

export type StatusTableTemplate = {
  type: ElementType.StatusTable;
  id: string;
  to: PageId;
};

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
