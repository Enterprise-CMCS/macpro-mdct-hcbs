import { ImaTableColumn, ImaTableRow } from "../../../types/reports";

const PERMISSIBLE_NOT_USED_ANSWER_ID = "data-source-no-permissible-not-used";

export const INCIDENT_REPORTING_COLUMNS: ImaTableColumn[] = [
  {
    id: "incident-description",
    label: "Incident type",
    type: "description",
  },
  { id: "incident-yes", label: "Yes", type: "answer" },
  { id: "incident-no", label: "No", type: "answer", nonCompliant: true },
];

export const DATA_SOURCE_COLUMNS: ImaTableColumn[] = [
  { id: "data-source-description", label: "Data source", type: "description" },
  {
    id: "data-source-yes-used",
    label: "Yes, we use this data source to identify critical incidents",
    type: "answer",
  },
  {
    id: "data-source-no-not-permissible",
    label: "No, data sharing is not permissible under state law",
    type: "answer",
  },
  {
    id: "data-source-no-permissible-not-used",
    label:
      "No, data sharing is permissible but we do not use this data source to identify critical incidents",
    type: "answer",
  },
  {
    id: "data-source-delete",
    label: "Delete",
    type: "delete",
  },
];

export const UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_DURING: ImaTableRow[] = [
  {
    id: "claims-data",
    description: "Claims data (e.g., MMIS)",
    nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
  },
  {
    id: "medicaid-fraud-control-unit",
    description: "Medicaid Fraud Control Unit (MFCU) data",
    nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
  },
  {
    id: "state-adult-protective-services",
    description: "State Adult Protective Services (APS) data",
    nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
  },
  {
    id: "state-child-protective-services",
    description: "State Child Protective Services (CPS) data",
    nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
  },
  {
    id: "other-state-agency",
    description: "Data from other state agency",
  },
  {
    id: "hospitalization-data",
    description: "Hospitalization data",
  },
  {
    id: "emergency-room-data",
    description: "Emergency room data",
  },
  {
    id: "electronic-visit-verification",
    description: "Electronic Visit Verification (EVV)",
  },
  {
    id: "provider-licensing",
    description: "Provider Licensing",
  },
];

export const UNREPORTED_CRITICAL_INCIDENT_DATA_SOURCES_FAILURE: ImaTableRow[] =
  [
    {
      id: "claims-data",
      description: "Claims data (e.g., MMIS)",
      nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
    },
    {
      id: "medicaid-fraud-control-unit",
      description: "Medicaid Fraud Control Unit (MFCU)",
      nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
    },
    {
      id: "state-adult-protective-services",
      description: "State Adult Protective Services (APS)",
      nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
    },
    {
      id: "state-child-protective-services",
      description: "State Child Protective Services (CPS)",
      nonCompliantAnswers: [PERMISSIBLE_NOT_USED_ANSWER_ID],
    },
    {
      id: "other-state-agency",
      description: "Other State Agency",
    },
    {
      id: "hospitalization-data",
      description: "Hospitalization data",
    },
    {
      id: "emergency-room-data",
      description: "Emergency room data",
    },
    {
      id: "electronic-visit-verification",
      description: "Electronic Visit Verification (EVV)",
    },
    {
      id: "provider-licensing",
      description: "Provider Licensing",
    },
  ];
