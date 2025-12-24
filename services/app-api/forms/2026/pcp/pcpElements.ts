import { ElementType, NdrBasicTemplate } from "../../../types/reports";
import { minPerformanceExplanationField } from "../elements";

export const beneficiariesRate: NdrBasicTemplate = {
  type: ElementType.NdrBasic,
  id: "beneficiaries-rate",
  required: true,
  hintText: {
    numHint:
      "Number of beneficiaries who had a reassessment of functional need completed at least once within the measurement period across all applicable HCBS programs.",
    denomHint:
      "Number of beneficiaries who were due for an annual reassessment within the measurement period across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of beneficiaries continuously enrolled in an applicable HCBS program for at least 365 days for whom a reassessment of functional need was completed at least once within the measurement period, across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
  minPerformanceLevel: 90,
  conditionalChildren: [minPerformanceExplanationField],
};

export const beneficiariesReviewedRate: NdrBasicTemplate = {
  type: ElementType.NdrBasic,
  id: "pcp-2-rate",
  required: true,
  hintText: {
    numHint:
      "Number of beneficiaries who had their person-centered service plan reviewed, and updated as appropriate, based upon a reassessment of functional need, within the measurement period, across all applicable HCBS programs.",
    denomHint:
      "Number of beneficiaries who were due for an annual reassessment within the measurement period, across all applicable HCBS programs.",
    rateHint:
      "Auto-calculates. Percentage of beneficiaries continuously enrolled for at least 365 days in an applicable HCBS program who had their person-centered service plan reviewed, and updated as appropriate, based on a reassessment of functional need at least once within the measurement period, across all applicable HCBS programs.",
  },
  multiplier: 100,
  displayRateAsPercent: true,
  minPerformanceLevel: 90,
  conditionalChildren: [minPerformanceExplanationField],
};
