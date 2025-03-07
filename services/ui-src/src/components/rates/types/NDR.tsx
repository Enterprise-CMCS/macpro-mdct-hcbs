import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const NDR = (props: PerformanceRateTemplate) => {
  const { id, rateCalc, answer } = props;

  return (
    <div>
      <CmsdsTextField label="Numerator" name="numerator"></CmsdsTextField>
      <CmsdsTextField label="Denominator" name="denominator"></CmsdsTextField>
      <CmsdsTextField label="Rate" name="rate"></CmsdsTextField>
    </div>
  );
};
