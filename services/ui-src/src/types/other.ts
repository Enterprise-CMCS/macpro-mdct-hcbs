// ALERTS

export enum AlertTypes {
    ERROR = "error",
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
  }
  
// OTHER

export interface CustomHtmlElement {
    type: string;
    content: string | any;
    as?: string;
    props?: {[key: string]: any};
  }

export interface ErrorVerbiage {
    title: string;
    description: string;
}
