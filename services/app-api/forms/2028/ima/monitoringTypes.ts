import { ImaTableRow } from "../../../types/reports";

/** Row entries for the Monitoring Methods table.
 * Kept separate from the report template so the incident type list can be revised year over year.
 */

export const MONITORING_METHODS_TYPES: ImaTableRow[] = [
  {
    id: "compliance-reviews",
    description:
      "Compliance Reviews (e.g., site visit or desk audit of case notes)",
  },
  {
    id: "automated-summary",
    description:
      "Automated Summary from Tracking Tool (e.g., dashboards from IM system) ",
  },
  {
    id: "meeting-training-requirements",
    description: "Meeting Training Requirements",
  },
  {
    id: "individual-provider-surveys",
    description: "Individual Provider Surveys",
  },
  {
    id: "performance-measures",
    description: "Establishing and Tracking Performance Measures",
  },
];
