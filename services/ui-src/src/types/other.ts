// ALERTS

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

// TIME

export interface DateShape {
  year: number;
  month: number;
  day: number;
}

export interface TimeShape {
  hour: number;
  minute: number;
  second: number;
}

// OTHER
export interface AnyObject {
  [key: string]: any;
}

export interface CustomHtmlElement {
  type: string;
  content: string | any;
  as?: string;
  props?: { [key: string]: any };
  children?: CustomHtmlElement[];
}

export interface ErrorVerbiage {
  title: string;
  description: string | CustomHtmlElement[];
}
