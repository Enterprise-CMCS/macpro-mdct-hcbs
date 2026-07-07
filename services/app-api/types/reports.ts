// Templates

import { StateAbbr } from "../utils/constants";

export enum ReportType {
  QMS = "QMS",
  TACM = "TACM",
  CI = "CI",
  PCP = "PCP",
  QIP = "QIP",
  WWL = "WWL",
}
export const isReportType = (x: unknown): x is ReportType => {
  return Object.values(ReportType).includes(x as ReportType);
};

export interface ReportOptions {
  name: string;
  year: number;
  options: {
    cahps?: boolean;
    nciidd?: boolean;
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

export interface WAIVER {
  id: string;
  state: StateAbbr;
  controlNumber?: string;
  programTitle: string;
  waiverType: WaiverType;
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
  "LTSS-1" = "LTSS-1",
  "LTSS-2" = "LTSS-2",
  "LTSS-6" = "LTSS-6",
  "LTSS-7" = "LTSS-7",
  "LTSS-8" = "LTSS-8",
  "FFS-1" = "FFS-1",
  "FFS-2" = "FFS-2",
  "FFS-6" = "FFS-6",
  "FFS-7" = "FFS-7",
  "FFS-8" = "FFS-8",
  "MLTSS-1" = "MLTSS-1",
  "MLTSS-2" = "MLTSS-2",
  "MLTSS-6" = "MLTSS-6",
  "MLTSS-7" = "MLTSS-7",
  "MLTSS-8" = "MLTSS-8",
  // optional measures
  "MLTSS" = "MLTSS",
  "LTSS-3" = "LTSS-3",
  "LTSS-4" = "LTSS-4",
  "MLTSS-5" = "MLTSS-5",
  "FASI-1" = "FASI-1",
  "FASI-2" = "FASI-2",
  "HCBS-10" = "HCBS-10",
  "FFS-3" = "FFS-3",
  "FFS-4" = "FFS-4",
  "MLTSS-3" = "MLTSS-3",
  "MLTSS-4" = "MLTSS-4",
  "FFS-FASI-1" = "FFS-FASI-1",
  "FFS-FASI-2" = "FFS-FASI-2",
  "MLTSS-FASI-1" = "MLTSS-FASI-1",
  "MLTSS-FASI-2" = "MLTSS-FASI-2",
  // unique
  "MLTSS-DM" = "MLTSS-DM",
  "MLTSS-5-PT1" = "MLTSS-5-PT1",
  "MLTSS-5-PT2" = "MLTSS-5-PT2",
  "MLTSS-HCBS-10" = "MLTSS-HCBS-10",
  // pom measures
  "POM-1" = "POM-1",
  "POM-2" = "POM-2",
  "POM-3" = "POM-3",
  "POM-4" = "POM-4",
  "POM-5" = "POM-5",
  "POM-6" = "POM-6",
  "POM-7" = "POM-7",
  "FFS-POM-1" = "FFS-POM-1",
  "FFS-POM-2" = "FFS-POM-2",
  "FFS-POM-3" = "FFS-POM-3",
  "FFS-POM-4" = "FFS-POM-4",
  "FFS-POM-5" = "FFS-POM-5",
  "FFS-POM-6" = "FFS-POM-6",
  "FFS-POM-7" = "FFS-POM-7",
  "MLTSS-POM-1" = "MLTSS-POM-1",
  "MLTSS-POM-2" = "MLTSS-POM-2",
  "MLTSS-POM-3" = "MLTSS-POM-3",
  "MLTSS-POM-4" = "MLTSS-POM-4",
  "MLTSS-POM-5" = "MLTSS-POM-5",
  "MLTSS-POM-6" = "MLTSS-POM-6",
  "MLTSS-POM-7" = "MLTSS-POM-7",
}

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

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

export interface Report extends ReportBase, ReportOptions {
  id?: string;
  name: string;
  state: StateAbbr;
  created?: number;
  lastEdited?: number;
  lastEditedBy?: string;
  lastEditedByEmail?: string;
  submitted?: number;
  submissionDates?: { submitted: number }[];
  submittedBy?: string;
  submittedByEmail?: string;
  status: ReportStatus;
  submissionCount: number;
  archived: boolean;
}

export type LiteReport = Omit<Report, "pages">;

export interface ReviewSubmitTemplate extends FormPageTemplate {
  submittedView: PageElement[];
}

export interface MeasurePageTemplate extends FormPageTemplate {
  cmit?: number;
  cmitId: string;
  required?: boolean;
  substitutable?: string;
  dependentPages?: DependentPageInfo[];
  cmitInfo?: CMIT;
  waiverInfo?: WAIVER[];
}

export type ReportMeasureConfig = {
  measureLookup: {
    defaultMeasures: MeasureOptions[];
    pomMeasures: MeasureOptions[];
  };
  measureTemplates: Record<MeasureTemplateName, MeasurePageTemplate>;
};

export type ReportBase = {
  type: ReportType;
  year: number;
  pages: (
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate
  )[];
};
export type ReportWithMeasuresTemplate = ReportBase & ReportMeasureConfig;

export const isReportWithMeasuresTemplate = (
  report: ReportBase
): report is ReportWithMeasuresTemplate => {
  return "measureLookup" in report && "measureTemplates" in report;
};

export type PageTemplate =
  | ParentPageTemplate
  | FormPageTemplate
  | MeasurePageTemplate
  | ReviewSubmitTemplate;

export type ParentPageTemplate = {
  id: PageId;
  childPageIds: PageId[];
  navTitle?: undefined;
  tabTitle?: undefined;
  submittedTabTitle?: undefined;
  type?: undefined;
  elements?: undefined;
  sidebar?: undefined;
  hideNavButtons?: undefined;
};

export type FormPageTemplate = {
  id: PageId;
  navTitle: string;
  type: PageType;
  status?: PageStatus;
  tabTitle?: string;
  submittedTabTitle?: string;
  elements: PageElement[];
  sidebar?: boolean;
  hideNavButtons?: boolean;
  childPageIds?: PageId[];
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
  SubHeaderMeasure = "subHeaderMeasure",
  NestedHeading = "nestedHeading",
  Textbox = "textbox",
  TextAreaField = "textAreaField",
  NumberField = "numberField",
  Date = "date",
  DateRange = "dateRange",
  Dropdown = "dropdown",
  Accordion = "accordion",
  Paragraph = "paragraph",
  Radio = "radio",
  Checkbox = "checkbox",
  ButtonLink = "buttonLink",
  MeasureTable = "measureTable",
  MeasureResultsNavigationTable = "measureResultsNavigationTable",
  StatusTable = "statusTable",
  MeasureDetails = "measureDetails",
  MeasureFooter = "measureFooter",
  LengthOfStayRate = "lengthOfStay",
  ReadmissionRate = "readmissionRate",
  MultiCategoryNdr = "multiCategoryNdr",
  MultiRateNdr = "multiRateNdr",
  Ndr = "ndr",
  PerformanceNdr = "performanceNdr",
  StatusAlert = "statusAlert",
  Divider = "divider",
  SubmissionParagraph = "submissionParagraph",
  ListInput = "listInput",
  EligibilityTable = "eligibilityTable",
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | SubHeaderMeasureTemplate
  | NestedHeadingTemplate
  | TextboxTemplate
  | NumberFieldTemplate
  | TextAreaBoxTemplate
  | DateTemplate
  | DateRangeTemplate
  | DropdownTemplate
  | AccordionTemplate
  | ParagraphTemplate
  | RadioTemplate
  | CheckboxTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | MeasureResultsNavigationTableTemplate
  | StatusTableTemplate
  | MeasureDetailsTemplate
  | MeasureFooterTemplate
  | LengthOfStayRateTemplate
  | ReadmissionRateTemplate
  | MultiCategoryNdrTemplate
  | MultiRateNdrTemplate
  | NdrTemplate
  | PerformanceNdrTemplate
  | StatusAlertTemplate
  | DividerTemplate
  | SubmissionParagraphTemplate
  | EligibilityTableTemplate
  | ListInputTemplate;

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

export const isHeaderTemplate = (
  element: PageElement
): element is HeaderTemplate => {
  return element.type === ElementType.Header;
};

export type SubHeaderTemplate = {
  type: ElementType.SubHeader;
  id: string;
  text: string;
  helperText?: string;
  hideCondition?: HideCondition;
};

export type SubHeaderMeasureTemplate = {
  type: ElementType.SubHeaderMeasure;
  id: string;
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

export type TextboxTemplate = {
  type: ElementType.Textbox;
  id: string;
  label: string;
  helperText?: string;
  answer?: string;
  required: boolean;
  hideCondition?: HideCondition;
};

export type NumberFieldTemplate = {
  type: ElementType.NumberField;
  id: string;
  label: string;
  helperText?: string;
  answer?: number;
  required: boolean;
  hideCondition?: never;
};

export type TextAreaBoxTemplate = {
  type: ElementType.TextAreaField;
  id: string;
  label: string;
  helperText?: string;
  wordLimit?: number;
  answer?: string;
  hideCondition?: HideCondition;
  required: boolean;
};

export type DateTemplate = {
  type: ElementType.Date;
  id: string;
  label: string;
  helperText: string;
  dateFormat?: "MMDDYYYY" | "MMYYYY";
  answer?: string;
  required: boolean;
};

export type DateRangeTemplate = {
  type: ElementType.DateRange;
  id: string;
  labels: {
    top: string;
    start: string;
    end: string;
  };
  helperText: string;
  answer?: {
    start?: string;
    end?: string;
  };
  required: boolean;
};

export type DropdownTemplate = {
  type: ElementType.Dropdown;
  id: string;
  label: string;
  options: ChoiceTemplate[];
  helperText?: string;
  answer?: string;
  required: boolean;
};

export type DividerTemplate = {
  type: ElementType.Divider;
  id: string;
};

export type SubmissionParagraphTemplate = {
  type: ElementType.SubmissionParagraph;
  id: string;
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  id: string;
  label: string;
  value: string;
};

export type RadioTemplate = {
  type: ElementType.Radio;
  id: string;
  label: string;
  helperText?: string;
  choices: ChoiceTemplate[];
  answer?: string;
  required: boolean;
  hideCondition?: HideCondition;
  clickAction?: string;
};

export type CheckboxTemplate = {
  type: ElementType.Checkbox;
  id: string;
  label: string;
  choices: ChoiceTemplate[];
  helperText?: string;
  answer?: string[];
  emptyAlertTitle?: string;
  emptyAlertDescription?: string;
  required: boolean;
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  id: string;
  label?: string;
  to?: PageId;
  style?: string;
};

export type ListInputTemplate = {
  type: ElementType.ListInput;
  id: string;
  label: string;
  fieldLabel: string;
  helperText?: string;
  buttonText: string;
  answer?: string[];
  required: boolean;
};

export type MeasureDetailsTemplate = {
  type: ElementType.MeasureDetails;
  id: string;
};

export type MeasureFooterTemplate = {
  type: ElementType.MeasureFooter;
  id: string;
  prevTo?: string;
  nextTo?: string;
  completeMeasure?: boolean;
  completeSection?: boolean;
  clear?: boolean;
};

export const LengthOfStayFieldNames = {
  actualCount: "actualCount",
  denominator: "denominator",
  expectedCount: "expectedCount",
  populationRate: "populationRate",
  actualRate: "actualRate",
  expectedRate: "expectedRate",
  adjustedRate: "adjustedRate",
} as const;

export type LengthOfStayField =
  (typeof LengthOfStayFieldNames)[keyof typeof LengthOfStayFieldNames];

export type LengthOfStayHint = {
  actualCountHint?: string;
  denominatorHint?: string;
  expectedCountHint?: string;
  populationRateHint?: string;
  actualRateHint?: string;
  expectedRateHint?: string;
  adjustedRateHint?: string;
};

export type LengthOfStayRateTemplate = {
  id: string;
  type: ElementType.LengthOfStayRate;
  labels: Record<LengthOfStayField, string>;
  hintText?: LengthOfStayHint;
  answer?: Record<LengthOfStayField, number | undefined>;
  required: boolean;
  errors?: Record<LengthOfStayField, string>;
};

export const ReadmissionRateFieldNames = {
  stayCount: "stayCount",
  obsReadmissionCount: "obsReadmissionCount",
  obsReadmissionRate: "obsReadmissionRate",
  expReadmissionCount: "expReadmissionCount",
  expReadmissionRate: "expReadmissionRate",
  obsExpRatio: "obsExpRatio",
  beneficiaryCount: "beneficiaryCount",
  outlierCount: "outlierCount",
  outlierRate: "outlierRate",
} as const;

export type ReadmissionRateField =
  (typeof ReadmissionRateFieldNames)[keyof typeof ReadmissionRateFieldNames];

export type ReadmissionRateTemplate = {
  id: string;
  type: ElementType.ReadmissionRate;
  labels: Record<ReadmissionRateField, string>;
  answer?: Record<ReadmissionRateField, number | undefined>;
  required: boolean;
  errors?: Record<ReadmissionRateField, string>;
};

export type RateType = {
  id: string;
  numerator: number | undefined;
  rate: number | undefined;
};

export type RateData = {
  numerator: number | undefined;
  denominator: number | undefined;
  rate: number | undefined;
};

export type RateSetData = {
  denominator: number | undefined;
  rates: RateType[];
};

export type Assessment = {
  label: string;
  id: string;
  hints?: {
    hintNumerator?: string;
    hintDenominator?: string;
    hintRate?: string;
  };
};

export type NdrCategory = {
  label: string;
  id: string;
  autoCalc?: boolean;
  hintRate?: string;
};

export type MultiCategoryNdrTemplate = {
  id: string;
  type: ElementType.MultiCategoryNdr;
  assessments: Assessment[];
  categories: NdrCategory[];
  hint?: string;
  hintNumerator?: string;
  multiplier?: number;
  answer?: RateSetData[];
  required: boolean;
};

export type MultiRateNdrTemplate = {
  id: string;
  type: ElementType.MultiRateNdr;
  label?: string;
  hint?: string;
  helperText?: string;
  assessments: Assessment[];
  answer?: RateSetData;
  required: boolean;
};

export type NdrTemplate = {
  id: string;
  type: ElementType.Ndr;
  label: string;
  hintText?: {
    numeratorHint?: string;
    denominatorHint?: string;
    rateHint?: string;
  };
  answer?: RateData;
  required: boolean;
};

export type PerformanceNdrTemplate = {
  id: string;
  type: ElementType.PerformanceNdr;
  label?: string;
  answer?: RateData;
  hintText?: {
    numHint?: string;
    denomHint?: string;
    rateHint?: string;
  };
  required: boolean;
  multiplier?: number;
  displayRateAsPercent?: boolean;
  minPerformanceLevel?: number;
  conditionalChildren?: PageElement[];
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

export enum WaiverType {
  WAIVER1915C = "1915(c) waiver",
  SPA1915J = "1915(j) SPA",
  SPA1915I = "1915(i) SPA",
  SPA1015K = "1915(k) SPA",
  DEMO1115 = "1115 Demonstration",
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

export type MeasureTableTemplate = {
  id: string;
  type: ElementType.MeasureTable;
  caption: string;
  measureDisplay: "required" | "optional";
};

export type EligibilityTableItem = {
  title: string;
  description: string;
  recheck: string;
  frequency: string;
  eligibilityUpdate: string;
};

export type EligibilityTableTemplate = {
  type: ElementType.EligibilityTable;
  id: string;
  caption: string;
  fieldLabels: {
    title: string;
    description: string;
    recheck: string;
    frequency: string;
    eligibilityUpdate: string;
  };
  modalInstructions: string;
  frequencyOptions: { label: string; value: string }[];
  answer?: EligibilityTableItem[];
};

export type MeasureResultsNavigationTableTemplate = {
  type: ElementType.MeasureResultsNavigationTable;
  id: string;
  measureDisplay: "quality";
  hideCondition?: HideCondition;
};

export type StatusTableTemplate = {
  type: ElementType.StatusTable;
  id: string;
  to: PageId;
};

export type StatusAlertTemplate = {
  type: ElementType.StatusAlert;
  id: string;
  title: string;
  text: string;
  status: AlertTypes;
};

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
