import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const NDREnhanced = (props:PerformanceRateTemplate) => {
  const { id, rateCalc, answer } = props;

  return (
    <div>
      <CmsdsTextField
        label="Performance Rates Denominator"
        name="Performance Rates Denominator"
      ></CmsdsTextField>
      <CmsdsTextField label="Numerator" name="numerator"></CmsdsTextField>
      <CmsdsTextField label="Denominator" name="denominator"></CmsdsTextField>
      <CmsdsTextField label="Rate" name="rate"></CmsdsTextField>
    </div>
  );
};
