// BANNERS
export const bannerId = "admin-banner-id";

export const ErrorMessages = {
  endDateBeforeStartDate: "End date can't be before start date",
  mustBeADate: "Response must be a date in MMDDYYYY format",
  mustBeADateOptional:
    "If provided, response must be a date in MMDDYYYY format",
  mustBeANumber: "Response must be a number",
  requiredResponse: "A response is required",
  mustBeAnEmail: "Response must be a valid email address",
} as const;

export const PRODUCTION_HOST_DOMAIN = "mdctlabs.cms.gov";

export const notAnsweredText = "Not answered";
export const autoPopulatedText = "Auto-populates from previous response";
export const autoCalculatesText = "Auto-calculates from previous response";

export const HELP_DESK_EMAIL_ADDRESS = "mdct_help@cms.hhs.gov" as const;

// STATES
export const StateNames = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FM: "Federated States of Micronesia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
} as const;

// TIMEOUT PARAMS
export const IDLE_WINDOW = 30 * 60 * 1000; // ms
export const PROMPT_AT = 29 * 60 * 1000; //ms
