import { ReportType } from "./report";

/** The shape of the request body for creating a banner */
export interface BannerFormData {
  title: string;
  area: BannerArea;
  description: string;
  link?: string;
  startDate: string;
  endDate: string;
}

/** The shape of a complete banner, as stored in the database */
export interface BannerShape extends BannerFormData {
  key: string;
  createdAt: string;
  lastAltered: string;
  lastAlteredBy: string;
}

export const BannerAreas = {
  ...ReportType,
  Home: "home",
} as const;

/** A banner may be shown on the home page, or any report type's dashboard. */
export type BannerArea = (typeof BannerAreas)[keyof typeof BannerAreas];
export const isBannerArea = (x: unknown): x is BannerArea => {
  return Object.values(BannerAreas).includes(x as BannerArea);
};

/** Determines the display names _and order_  on the Banner Editor page. */
export const bannerAreaLabels: Record<BannerArea, string> = {
  [BannerAreas.Home]: "Home page",
  [BannerAreas.CI]: "CI report dashboard",
  [BannerAreas.PCP]: "PCP report dashboard",
  [BannerAreas.QMS]: "QMS report dashboard",
  [BannerAreas.TACM]: "TACM report dashboard",
  [BannerAreas.WWL]: "WWL report dashboard",
};
