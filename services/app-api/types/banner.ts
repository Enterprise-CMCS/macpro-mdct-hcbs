import { IsoDateString, UrlString } from "./types";
import { ReportType } from "./reports";

/** The shape of the request body for creating a banner */
export interface BannerFormData {
  title: string;
  area: BannerArea;
  description: string;
  link?: UrlString;
  startDate: IsoDateString;
  endDate: IsoDateString;
}

/** The shape of a complete banner, as stored in the database */
export interface BannerShape extends BannerFormData {
  key: string;
  createdAt: IsoDateString;
  lastAltered: IsoDateString;
  lastAlteredBy: IsoDateString;
}

export const BannerAreas = {
  ...ReportType,
  Home: "home",
} as const;
export type BannerArea = (typeof BannerAreas)[keyof typeof BannerAreas];
export const isBannerArea = (x: unknown): x is BannerArea => {
  return Object.values(BannerAreas).includes(x as BannerArea);
};
