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

// Templates

export interface FormOptions {
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
  measureLookup: {
    defaultMeasures: MeasureOptions[];
    optionGroups: Record<string, MeasureOptions[]>;
  };
  sections: SectionTemplate[];
  measureTemplates: Record<MeasureTemplateName, MeasureTemplate>;
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
