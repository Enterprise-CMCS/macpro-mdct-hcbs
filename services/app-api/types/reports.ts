// Templates

import { DataSource, DeliverySystem, ReportType } from "../utils/constants";

export interface FormOptions {
  type: ReportType;
  stateOptions: string[];
  state: string | undefined;
  createdBy: string | undefined;
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

export interface FormTemplate {
  reportType: ReportType;
  measureLookup: {
    defaultMeasures: MeasureOptions[];
    optionGroups: Record<string, MeasureOptions[]>;
  };
  sections: SectionTemplate[];
  measureTemplates: Record<MeasureTemplateName, MeasureTemplate>;
}

export interface Report extends FormTemplate {
  id?: string;
  state: string;
  created?: number;
  lastEdited?: number;
  lastEditedBy?: string;
}

export interface MeasureTemplate {
  pageElements: PageElements[];
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
