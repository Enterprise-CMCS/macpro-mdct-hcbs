import { StateAbbr } from "./other";

export enum ReportType {
  QMS = "QMS",
  TA = "TA",
  CI = "CI",
}

export const isReportType = (
  reportType: string | undefined
): reportType is ReportType => {
  return Object.values(ReportType).includes(reportType as ReportType);
};

export enum ReportStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  SUBMITTED = "Submitted",
}
export const isReportStatus = (status: string): status is ReportStatus => {
  return Object.values(ReportStatus).includes(status as ReportStatus);
};

export type ReportTemplate = ReportOptions & {
  type: ReportType;
  title: string;
  pages: (ParentPageTemplate | FormPageTemplate | MeasurePageTemplate)[];
  measureLookup: {
    defaultMeasures: MeasureOptions[];
    optionGroups: Record<string, MeasureOptions[]>;
  };
  measureTemplates: Record<MeasureTemplateName, MeasurePageTemplate>;
};

export interface Report extends ReportTemplate {
  id?: string;
  state: StateAbbr;
  created?: number;
  lastEdited?: number;
  lastEditedBy?: string;
  status: ReportStatus;
}

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
  hideNavButtons?: undefined;
};
export const isParentPage = (
  page: PageTemplate
): page is ParentPageTemplate => {
  return "childPageIds" in page;
};

export interface PageData {
  parent: string;
  childPageIds: string[];
  index: number;
}

export type FormPageTemplate = {
  id: PageId;
  title: string;
  type: PageType;
  elements: PageElement[];
  sidebar?: boolean;
  hideNavButtons?: boolean;
  childPageIds?: PageId[];
};

export interface MeasurePageTemplate extends FormPageTemplate {
  cmit?: number;
  required?: boolean;
  stratified?: boolean;
  optional?: boolean;
  substitutable?: boolean;
}

export interface StatusPageTemplate extends FormPageTemplate {
  required?: boolean;
  stratified?: boolean;
  optional?: boolean;
}

export const isMeasureTemplate = (
  element: PageTemplate
): element is FormPageTemplate => {
  return element.type === PageType.Measure;
};

export const isChildPage = (page: PageTemplate): page is FormPageTemplate => {
  return "elements" in page;
};

export type PageId = string;

export enum PageType {
  Standard = "standard",
  Modal = "modal",
  Measure = "measure", // guarantees lookup info
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
  | ParagraphTemplate
  | RadioTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | QualityMeasureTableTemplate
  | StatusTableTemplate
  | MeasureFooterTemplate;

export type HeaderTemplate = {
  type: ElementType.Header;
  text: string;
};

export type SubHeaderTemplate = {
  type: ElementType.SubHeader;
  text: string;
};

export type ParagraphTemplate = {
  type: ElementType.Paragraph;
  title?: string;
  text: string;
};

export type TextboxTemplate = {
  type: ElementType.Textbox;
  label: string;
  helperText?: string;
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type TextAreaBoxTemplate = {
  type: ElementType.TextAreaField;
  label: string;
  helperText?: string;
  answer?: string;
};

export type DateTemplate = {
  type: ElementType.Date;
  label: string;
  helperText: string;
  answer?: string;
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  label: string;
  value: string;
};

export type MeasureTableTemplate = {
  type: ElementType.MeasureTable;
  measureDisplay: "required" | "stratified" | "optional";
};

export type QualityMeasureTableTemplate = {
  type: ElementType.QualityMeasureTable;
  measureDisplay: "quality";
};

export type StatusTableTemplate = {
  type: ElementType.StatusTable;
};

export type RadioTemplate = {
  type: ElementType.Radio;
  label: string;
  value: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  label: string;
  to: PageId;
};

export type MeasureFooterTemplate = {
  type: ElementType.MeasureFooter;
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

export enum DeliverySystem {
  FFS = "FFS",
  MLTSS = "MLTSS",
}

export enum DataSource {
  CaseRecordManagement,
  Administrative,
  Hybrid,
  RecordReview,
  Survey,
}

export enum MeasureSteward {
  CMS,
  CQL,
}

export enum MeasureSpecification {
  CMS = "CMS",
  HEDIS = "HEDIS",
  CQL = "CQL",
}

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
  measureTemplate: [MeasureTemplateName];
}

export enum MeasureTemplateName {
  "LTSS-1",
  "LTSS-2",
  "LTSS-6",
  "LTSS-7",
  "LTSS-8",
  "POM-1",
  "POM-2",
}

export interface FormComponent {
  id: string;
  type: string;
}

export interface Input extends FormComponent {
  type: "input";
  inputType: string;
  questionText: string;
  answer: string | number | undefined;
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

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
