import { ReportType } from "../types/reports";

export const error = {
  UNAUTHORIZED: "User is not authorized to access this resource.",
  NO_KEY: "Must provide key for table.",
  MISSING_DATA: "Missing required data.",
  INVALID_DATA: "Provided data is not valid.",
  SERVER_ERROR: "An unspecified server error occured.",
  CREATION_ERROR: "Could not be created due to a database error.",
  ALREADY_ARCHIVED: "Cannot update archived report.",
  END_DATE_BEFORE_START_DATE: "End date can't be before start date",
};

export enum DeliverySystem {
  FFS = "FFS",
  MLTSS = "MLTSS",
}

export enum DataSource {
  CaseRecordManagement = "CaseRecordManagement",
  Administrative = "Administrative",
  Hybrid = "Hybrid",
  RecordReview = "RecordReview",
  Survey = "Survey",
}

export enum MeasureSteward {
  CMS = "CMS",
  CQL = "CQL",
}

export enum MeasureSpecification {
  CMS = "CMS",
  HEDIS = "HEDIS",
  CQL = "CQL",
}

export enum StateNames {
  AL = "Alabama",
  AK = "Alaska",
  AS = "American Samoa",
  AZ = "Arizona",
  AR = "Arkansas",
  CA = "California",
  CO = "Colorado",
  CT = "Connecticut",
  DE = "Delaware",
  DC = "District of Columbia",
  FM = "Federated States of Micronesia",
  FL = "Florida",
  GA = "Georgia",
  GU = "Guam",
  HI = "Hawaii",
  ID = "Idaho",
  IL = "Illinois",
  IN = "Indiana",
  IA = "Iowa",
  KS = "Kansas",
  KY = "Kentucky",
  LA = "Louisiana",
  ME = "Maine",
  MH = "Marshall Islands",
  MD = "Maryland",
  MA = "Massachusetts",
  MI = "Michigan",
  MN = "Minnesota",
  MS = "Mississippi",
  MO = "Missouri",
  MT = "Montana",
  NE = "Nebraska",
  NV = "Nevada",
  NH = "New Hampshire",
  NJ = "New Jersey",
  NM = "New Mexico",
  NY = "New York",
  NC = "North Carolina",
  ND = "North Dakota",
  MP = "Northern Mariana Islands",
  OH = "Ohio",
  OK = "Oklahoma",
  OR = "Oregon",
  PW = "Palau",
  PA = "Pennsylvania",
  PR = "Puerto Rico",
  RI = "Rhode Island",
  SC = "South Carolina",
  SD = "South Dakota",
  TN = "Tennessee",
  TX = "Texas",
  UT = "Utah",
  VT = "Vermont",
  VI = "Virgin Islands",
  VA = "Virginia",
  WA = "Washington",
  WV = "West Virginia",
  WI = "Wisconsin",
  WY = "Wyoming",
}
export type StateAbbr = keyof typeof StateNames;
export const isStateAbbreviation = (x: string | undefined): x is StateAbbr => {
  return Object.keys(StateNames).includes(x!);
};

export const reportTables: { [key in ReportType]: string } = {
  QMS: process.env.QmsReportsTable!,
  TACM: process.env.TacmReportsTable!,
  CI: process.env.CiReportsTable!,
  PCP: process.env.PcpReportsTable!,
  WWL: process.env.WwlReportsTable!,
};

export const tableTopics: { [key in ReportType]: string } = {
  QMS: "qms-reports",
  TACM: "tacm-reports",
  CI: "ci-reports",
  PCP: "pcp-reports",
  WWL: "wwl-reports",
};
