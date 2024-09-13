export type ReportTemplate = {
  type: ReportType;
  title: string;
  pages: (ParentPageTemplate | FormPageTemplate)[];
};

export type PageTemplate = ParentPageTemplate | FormPageTemplate;

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

  childPageIds?: PageId[];
};
export const isChildPage = (page: PageTemplate): page is FormPageTemplate => {
  return "elements" in page;
};

export enum ReportType {
  HCBS = "hcbs",
}

export type PageId = string;

export enum PageType {
  Standard = "standard",
  Modal = "modal",
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
}

export type PageElement =
  | HeaderTemplate
  | SubHeaderTemplate
  | TextboxTemplate
  | DateTemplate
  | AccordionTemplate
  | ResultRowButtonTemplate
  | ParagraphTemplate
  | RadioTemplate
  | ButtonLinkTemplate;

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
  text: string;
};

export type TextboxTemplate = {
  type: ElementType.Textbox;
  label: string;
  helperText?: string;
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

export type ResultRowButtonTemplate = {
  type: ElementType.ResultRowButton;
  value: string;
  modalId: PageId;
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

export type NavigationFunction = (page: PageId, type?: PageType) => void;

/**
 * Instructs Typescript to complain if it detects that this function may be reachable.
 * Useful for the default branch of a switch statement that verifiably covers every case.
 */
export const assertExhaustive = (_: never): void => {};
