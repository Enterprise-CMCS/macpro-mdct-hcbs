// ALERTS

import { ReactNode } from "react";
import { StateNames } from "../constants";

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

export interface TableContentShape {
  caption?: string;
  headRow?: string[];
  bodyRows?: string[][];
  footRow?: string[][];
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
  children: ReactNode;
}

export type StateAbbr = keyof typeof StateNames;
export const isStateAbbr = (abbr: string | undefined): abbr is StateAbbr => {
  return Object.keys(StateNames).includes(abbr as keyof typeof StateNames);
};
