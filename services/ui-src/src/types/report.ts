export type ReportTemplate = {
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
  state: string;
  created?: number;
  lastEdited?: number;
  lastEditedBy?: string;
  answers?: any[]; //TODO: any
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

export enum ReportType {
  QM = "qm",
}

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
  Date = "date",
  Accordion = "accordion",
  ResultRowButton = "resultRowButton",
  Paragraph = "paragraph",
  Radio = "radio",
  ButtonLink = "buttonLink",
  MeasureTable = "measureTable",
  StatusTable = "statusTable",
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | TextboxTemplate
  | DateTemplate
  | AccordionTemplate
  | ParagraphTemplate
  | RadioTemplate
  | ButtonLinkTemplate
  | MeasureTableTemplate
  | StatusTableTemplate;

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
};

export type DateTemplate = {
  type: ElementType.Date;
  label: string;
  helperText: string;
};

export type AccordionTemplate = {
  type: ElementType.Accordion;
  label: string;
  value: string;
};

export type MeasureTableTemplate = {
  type: ElementType.MeasureTable;
  measureDisplay: "required" | "stratified" | "optional";
  modalId: PageId;
  to: PageId;
};

export type StatusTableTemplate = {
  type: ElementType.StatusTable;
  to: PageId;
};

export type RadioTemplate = {
  type: ElementType.Radio;
  label: string;
  value: ChoiceTemplate[];
};

export type ButtonLinkTemplate = {
  type: ElementType.ButtonLink;
  label: string;
  to: PageId;
};

export type ChoiceTemplate = {
  label: string;
  value: string;
};

export enum DeliverySystem {
  FFS,
  MLTSS,
}

export enum DataSource {
  CaseRecordManagement,
  Administrative,
}

export enum MeasureSteward {
  CMS,
}

export interface CMIT {
  cmit: number;
  name: string;
  uid: string;
  options: string;
  deliverySystem: DeliverySystem[];
  measureSteward: string;
  dataSource: DataSource;
}

export interface MeasureOptions {
  cmit: number;
  required: boolean;
  stratified: boolean;
  measureTemplate: MeasureTemplateName;
}

export enum MeasureTemplateName {
  StandardMeasure,
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
