import { ImaTableRow } from "../../../types/reports";

/** Row entries for the Critical Incident Definition table.
 * Kept separate from the report template so the incident type list can be revised year over year.
 */

export const CRITICAL_INCIDENT_TYPES: ImaTableRow[] = [
  {
    id: "verbal-abuse",
    description: "Verbal abuse",
  },
  {
    id: "physical-abuse",
    description: "Physical abuse",
  },
  {
    id: "sexual-abuse",
    description: "Sexual abuse",
  },
  {
    id: "psychological-abuse",
    description: "Psychological abuse",
  },
  {
    id: "emotional-abuse",
    description: "Emotional abuse",
  },
  {
    id: "neglect",
    description: "Neglect",
  },
  {
    id: "financial-exploitation",
    description: "Exploitation, including financial exploitation",
  },
  {
    id: "misuse-restrictive-interventions",
    description: "Misuse of restrictive interventions or seclusion",
  },
  {
    id: "unauthorized-restrictive-interventions",
    description: "Unauthorized use of restrictive interventions or seclusion",
  },
  {
    id: "medication-error",
    description:
      "A medication error leading to contact with a poison control center, a visit to urgent care or the ER, hospitalization, or death",
  },
  {
    id: "death",
    description:
      "An unexplained or unanticipated death, including but not limited to death caused by abuse or neglect",
  },
];
