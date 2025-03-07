import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const Fields = (props: PerformanceRateTemplate) => {
  const { id, rateCalc, answer } = props;

  return (
    <div>
      <CmsdsTextField
        label="Count of Successful Discharges to Community"
        name="numerator"
      ></CmsdsTextField>
      <CmsdsTextField label="Denominator" name="denominator"></CmsdsTextField>
      <CmsdsTextField label="Rate" name="rate"></CmsdsTextField>
    </div>
  );
};
