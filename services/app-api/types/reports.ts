// Templates

import { StateAbbr } from "../utils/constants";

export enum ReportType {
  XYZ = "XYZ",
}
export const isReportType = (x: string | undefined): x is ReportType => {
  return Object.values(ReportType).includes(x as ReportType);
};

export interface ReportOptions {
  name: string;
  year: number;
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
  "LABS-10" = "LABS-10",
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
  "MLTSS-LABS-10" = "MLTSS-LABS-10",
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
  Dropdown = "dropdown",
  Accordion = "accordion",
  Paragraph = "paragraph",
  Radio = "radio",
  ButtonLink = "buttonLink",
  MeasureTable = "measureTable",
  MeasureResultsNavigationTable = "measureResultsNavigationTable",
  StatusTable = "statusTable",
  MeasureDetails = "measureDetails",
  MeasureFooter = "measureFooter",
  LengthOfStayRate = "lengthOfStay",
  NdrFields = "ndrFields",
  NdrEnhanced = "ndrEnhanced",
  Ndr = "ndr",
  NdrBasic = "ndrBasic",
  StatusAlert = "statusAlert",
  Divider = "divider",
  SubmissionParagraph = "submissionParagraph",
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
  | DropdownTemplate
  | AccordionTemplate
  | ParagraphTemplate
  | RadioTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | MeasureResultsNavigationTableTemplate
  | StatusTableTemplate
  | MeasureDetailsTemplate
  | MeasureFooterTemplate
  | LengthOfStayRateTemplate
  | NdrFieldsTemplate
  | NdrEnhancedTemplate
  | NdrTemplate
  | NdrBasicTemplate
  | StatusAlertTemplate
  | DividerTemplate
  | SubmissionParagraphTemplate;

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
  answer?: string;
  hideCondition?: HideCondition;
  required: boolean;
};

export type DateTemplate = {
  type: ElementType.Date;
  id: string;
  label: string;
  helperText: string;
  answer?: string;
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
  prevTo?: string;
  nextTo?: string;
  completeMeasure?: boolean;
  completeSection?: boolean;
  clear?: boolean;
};

export const LengthOfStayFieldNames = {
  performanceTarget: "performanceTarget",
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

export type LengthOfStayRateTemplate = {
  id: string;
  type: ElementType.LengthOfStayRate;
  labels: Record<LengthOfStayField, string>;
  answer?: Record<LengthOfStayField, number | undefined>;
  required: boolean;
  errors?: Record<LengthOfStayField, string>;
};

export const RateInputFieldNames = {
  performanceTarget: "performanceTarget",
  numerator: "numerator",
  denominator: "denominator",
} as const;
export type RateInputFieldName =
  (typeof RateInputFieldNames)[keyof typeof RateInputFieldNames];

export type RateType = {
  id: string;
  numerator: number | undefined;
  rate: number | undefined;
  performanceTarget: number | undefined;
};

export type RateData = {
  performanceTarget?: number | undefined;
  numerator: number | undefined;
  denominator: number | undefined;
  rate: number | undefined;
};

export type RateSetData = {
  denominator: number | undefined;
  rates: RateType[];
};

export type NdrFieldsTemplate = {
  id: string;
  type: ElementType.NdrFields;
  labelTemplate: string;
  assessments: { label: string; id: string }[];
  fields: { label: string; id: string; autoCalc?: boolean }[];
  multiplier?: number;
  answer?: RateSetData[];
  required: boolean;
};

export type NdrEnhancedTemplate = {
  id: string;
  type: ElementType.NdrEnhanced;
  label?: string;
  helperText?: string;
  performanceTargetLabel?: string | undefined;
  assessments: { label: string; id: string }[];
  answer?: RateSetData;
  required: boolean;
};

export type NdrTemplate = {
  id: string;
  type: ElementType.Ndr;
  label: string;
  performanceTargetLabel: string;
  answer?: RateData;
  required: boolean;
};

export type NdrBasicTemplate = {
  id: string;
  type: ElementType.NdrBasic;
  label?: string;
  answer?: RateData;
  hintText?: {
    numHint: string | undefined;
    denomHint: string | undefined;
    rateHint: string | undefined;
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
  measureDisplay: "required" | "optional";
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
  title?: string;
  text: string;
  status: AlertTypes;
};

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
