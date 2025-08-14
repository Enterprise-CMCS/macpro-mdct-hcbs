import { ReactNode } from "react";
import { StateNames } from "../constants";

export enum AlertTypes {
  ERROR = "error",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
}

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

export interface ErrorVerbiage {
  title: string;
  children: ReactNode;
}

export type StateAbbr = keyof typeof StateNames;
export const isStateAbbr = (abbr: string | undefined): abbr is StateAbbr => {
  return Object.keys(StateNames).includes(abbr as keyof typeof StateNames);
};
