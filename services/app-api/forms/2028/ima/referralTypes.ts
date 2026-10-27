import { ImaTableRow } from "../../../types/reports";

/** Row entries for the Investigation Referrals table.
 * Kept separate from the report template so the incident type list can be revised year over year.
 */

export const INVESTIGATION_REFERRAL_TYPES: ImaTableRow[] = [
  {
    id: "provider-licensing",
    description: "Provider licensing and/or credentialing",
  },
  {
    id: "provider-screening",
    description: "Provider screening, enrollment, suspension and termination",
  },
  {
    id: "abuse-registry",
    description: "Agency that manages the Abuse Registry",
  },
  {
    id: "adult-protective-services",
    description: "Adult Protective Services (APS)",
  },
  {
    id: "child-protective-services",
    description: "Child Protective Services (CPS)",
  },
  {
    id: "medicaid-fraud-control-unit",
    description: "Medicaid Fraud Control Unit (MFCU)",
  },
  {
    id: "neighboring-states",
    description: "Neighboring states",
  },
  {
    id: "state-medicaid-agency",
    description: "State Medicaid Agency",
  },
  {
    id: "operating-agency",
    description: "Operating Agency",
  },
  {
    id: "other-entity",
    description: "Other entity",
  },
];
