import { AnyObject, StateAbbr } from "./other";

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

export enum MeasureStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  COMPLETE = "Complete",
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
  cmitId: string;
  required?: boolean;
  stratified?: boolean;
  optional?: boolean;
  substitutable?: string;
  status: MeasureStatus;
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
  NestedHeading = "nestedHeading",
  Textbox = "textbox",
  TextAreaField = "textAreaField",
  Date = "date",
  Dropdown = "dropdown",
  Accordion = "accordion",
  ResultRowButton = "resultRowButton",
  Paragraph = "paragraph",
  Radio = "radio",
  ReportingRadio = "reportingRadio",
  ButtonLink = "buttonLink",
  MeasureTable = "measureTable",
  QualityMeasureTable = "qualityMeasureTable",
  StatusTable = "statusTable",
  MeasureDetails = "measureDetails",
  MeasureFooter = "measureFooter",
  PerformanceRate = "performanceRate",
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | NestedHeadingTemplate
  | TextboxTemplate
  | TextAreaBoxTemplate
  | DateTemplate
  | DropdownTemplate
  | AccordionTemplate
  | ParagraphTemplate
  | RadioTemplate
  | ReportingRadioTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | QualityMeasureTableTemplate
  | StatusTableTemplate
  | MeasureDetailsTemplate
  | MeasureFooterTemplate
  | PerformanceRateTemplate;

export type HeaderTemplate = {
  type: ElementType.Header;
  id: string;
  text: string;
};

export type SubHeaderTemplate = {
  type: ElementType.SubHeader;
  id: string;
  text: string;
  helperText?: string;
};

export type NestedHeadingTemplate = {
  type: ElementType.NestedHeading;
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

export type DropdownTemplate = {
  type: ElementType.Dropdown;
  id: string;
  label: string;
  options: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required?: string;
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  id: string;
  label: string;
  value: string;
};

export type MeasureTableTemplate = {
  type: ElementType.MeasureTable;
  id: string;
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
};

export type RadioTemplate = {
  type: ElementType.Radio;
  id: string;
  label: string;
  value: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type ReportingRadioTemplate = {
  type: ElementType.ReportingRadio;
  id: string;
  label: string;
  value: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required?: string; //takes error message to display if not provided
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  id: string;
  label: string;
  to: PageId;
};

export type MeasureDetailsTemplate = {
  type: ElementType.MeasureDetails;
  id: string;
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

export type PerformanceData = {
  rates: AnyObject[];
  denominator?: number;
};

export const enum PerformanceRateType {
  NDR = "NDR",
  NDR_Ehanced = "NDREnhanced",
  FIELDS = "Fields",
}

export const enum RateCalc {
  NDRCalc = "NDRCalc",
  FacilityLengthOfStayCalc = "FacilityLengthOfStayCalc",
}

export type PerformanceRateTemplate = {
  id: string;
  type: ElementType.PerformanceRate;
  helperText?: string;
  assessments?: [{ label: string; id: string }];
  fields?: [{ label: string; id: string; autoCalc?: boolean }];
  rateType: PerformanceRateType;
  rateCalc?: RateCalc;
  multiplier?: number;
  answer?: PerformanceData;
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
  "LTSS-1" = "LTSS-1",
  "LTSS-2" = "LTSS-2",
  "LTSS-6" = "LTSS-6",
  "LTSS-7" = "LTSS-7",
  "LTSS-8" = "LTSS-8",
  "FFS-1" = "FFS-1",
  "FFS-2" = "FFS-2",
  "MLTSS-1" = "MLTSS-1",
  "MLTSS-2" = "MLTSS-2",
  "POM-1" = "POM-1",
  "POM-2" = "POM-2",
  "POM-3" = "POM-3",
  "POM-4" = "POM-4",
  "POM-5" = "POM-5",
  "POM-6" = "POM-6",
  "POM-7" = "POM-7",
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
