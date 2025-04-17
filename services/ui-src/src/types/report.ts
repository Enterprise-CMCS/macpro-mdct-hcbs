import { AlertTypes, AnyObject, StateAbbr } from "./other";

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

export enum PageStatus {
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
  pages: (
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate
  )[];
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
  submissionCount: number;
  archived: boolean;
}

export type PageTemplate =
  | ParentPageTemplate
  | FormPageTemplate
  | MeasurePageTemplate
  | ReviewSubmitTemplate;

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
  status?: PageStatus;
  elements: PageElement[];
  sidebar?: boolean;
  hideNavButtons?: boolean;
  childPageIds?: PageId[];
};

export interface ReviewSubmitTemplate extends FormPageTemplate {
  submittedView: PageElement[];
}

export const isReviewSubmitPage = (
  page: PageTemplate
): page is ReviewSubmitTemplate => {
  return page.type === PageType.ReviewSubmit && "submittedView" in page;
};

export interface MeasurePageTemplate extends FormPageTemplate {
  cmit?: number;
  cmitId: string;
  required?: boolean;
  stratified?: boolean;
  optional?: boolean;
  substitutable?: string;
  dependentPages?: DependentPageInfo[];
  cmitInfo?: CMIT;
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

export const isFormPageTemplate = (
  page: PageTemplate
): page is FormPageTemplate => {
  return (page as FormPageTemplate).title != undefined;
};

export const isMeasurePageTemplate = (
  page: PageTemplate
): page is MeasurePageTemplate => {
  return (page as MeasurePageTemplate).cmitId != undefined;
};

export type PageId = string;

export enum PageType {
  Standard = "standard",
  Modal = "modal",
  Measure = "measure",
  MeasureResults = "measureResults",
  ReviewSubmit = "reviewSubmit",
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
  MeasureResultsNavigationTable = "measureResultsNavigationTable",
  StatusTable = "statusTable",
  MeasureDetails = "measureDetails",
  MeasureFooter = "measureFooter",
  PerformanceRate = "performanceRate",
  StatusAlert = "statusAlert",
  Divider = "divider",
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
  | MeasureResultsNavigationTableTemplate
  | StatusTableTemplate
  | MeasureDetailsTemplate
  | MeasureFooterTemplate
  | PerformanceRateTemplate
  | StatusAlertTemplate
  | DividerTemplate;

export type HideCondition = {
  controllerElementId: string;
  answer: string;
};

export enum HeaderIcon {
  Check = "check",
}

export type HeaderTemplate = {
  type: ElementType.Header;
  id: string;
  text: string;
  icon?: HeaderIcon;
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
  weight?: string;
};

export type StatusAlertTemplate = {
  type: ElementType.StatusAlert;
  id: string;
  title?: string;
  text: string;
  status: AlertTypes;
};

export type TextboxTemplate = {
  type: ElementType.Textbox;
  id: string;
  label: string;
  helperText?: string;
  answer?: string;
  required?: boolean;
  hideCondition?: HideCondition;
};

export type TextAreaBoxTemplate = {
  type: ElementType.TextAreaField;
  id: string;
  label: string;
  helperText?: string;
  answer?: string;
  hideCondition?: HideCondition;
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
  required?: boolean;
};

export type DividerTemplate = {
  type: ElementType.Divider;
  id: string;
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

export type MeasureResultsNavigationTableTemplate = {
  type: ElementType.MeasureResultsNavigationTable;
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
  required?: boolean;
  hideCondition?: HideCondition;
};

export type ReportingRadioTemplate = {
  type: ElementType.ReportingRadio;
  id: string;
  label: string;
  value: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required?: boolean;
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  id: string;
  label?: string;
  to?: PageId;
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

export type RateType = {
  label: string;
  performanceTarget?: number;
  numerator?: number;
  denominator?: number;
  rate?: number;
  id?: string;
};

export type RateSetData = {
  id: string;
  label: string;
  denominator?: number;
  rates?: RateType[];
};

export const enum PerformanceRateType {
  NDR = "NDR",
  NDR_Enhanced = "NDREnhanced",
  FIELDS = "Fields",
  NDR_FIELDS = "NDRFields",
}

export const enum RateCalc {
  NDRCalc = "NDRCalc",
  FacilityLengthOfStayCalc = "FacilityLengthOfStayCalc",
}

export type PerformanceRateTemplate = {
  id: string;
  type: ElementType.PerformanceRate;
  label?: string;
  helperText?: string;
  assessments?: { label: string; id: string }[];
  fields?: { label: string; id: string; autoCalc?: boolean }[];
  rateType: PerformanceRateType;
  rateCalc?: RateCalc;
  multiplier?: number;
  answer?: PerformanceData | RateSetData[];
  required?: boolean;
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
  CaseRecordManagement = "CaseRecordManagement",
  Administrative = "Administrative",
  Hybrid = "Hybrid",
  RecordReview = "RecordReview",
  Survey = "Survey",
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
  deliverySystem: DeliverySystem[];
  measureSteward: string;
  measureSpecification: MeasureSpecification[];
  dataSource: DataSource;
}
export interface DependentPageInfo {
  key: string;
  linkText: string;
  template: MeasureTemplateName;
}

export interface MeasureOptions {
  cmit: number;
  uid: string;
  required: boolean;
  measureTemplate: MeasureTemplateName;
  dependentPages: DependentPageInfo[];
}

export enum MeasureTemplateName {
  // required measures
  "FFS-1" = "FFS-1",
  "FFS-2" = "FFS-2",
  "FFS-3" = "FFS-3",
  "FFS-6" = "FFS-6",
  "FFS-7" = "FFS-7",
  "FFS-8" = "FFS-8",
  "MLTSS-1" = "MLTSS-1",
  "MLTSS-2" = "MLTSS-2",
  "MLTSS-3" = "MLTSS-3",
  "MLTSS-6" = "MLTSS-6",
  "MLTSS-7" = "MLTSS-7",
  "MLTSS-8" = "MLTSS-8",
  "LTSS-1" = "LTSS-1",
  "LTSS-2" = "LTSS-2",
  "LTSS-6" = "LTSS-6",
  "LTSS-7" = "LTSS-7",
  "LTSS-8" = "LTSS-8",
  // optional measures
  "FASI-1" = "FASI-1",
  "FASI-2" = "FASI-2",
  "FFS-FASI-1" = "FFS-FASI-1",
  "MLTSS-FASI-1" = "MLTSS-FASI-1",
  "FFS-FASI-2" = "FFS-FASI-2",
  "MLTSS-FASI-2" = "MLTSS-FASI-2",
  "HCBS-10" = "HCBS-10",
  "MLTSS-HCBS-10" = "MLTSS-HCBS-10",
  "LTSS-3" = "LTSS-3",
  "LTSS-4" = "LTSS-4",
  "LTSS-5" = "LTSS-5",
  "LTSS-5-PT1" = "LTSS-5-PT1",
  "LTSS-5-PT2" = "LTSS-5-PT2",
  "MLTSS" = "MLTSS",
  "MLTSS-DM" = "MLTSS-DM",
  // pom measures
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
