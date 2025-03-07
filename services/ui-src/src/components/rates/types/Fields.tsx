import { Heading } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const Fields = (formkey: string, props: PerformanceRateTemplate) => {
  const { id, rateCalc, answer } = props;

  return (
    <div>
      <Heading variant="subHeader">Performance Rates</Heading>
      <CmsdsTextField
        label="Count of Successful Discharges to Community"
        name="numerator"
      ></CmsdsTextField>
      <CmsdsTextField label="Denominator" name="denominator"></CmsdsTextField>
      <CmsdsTextField label="Rate" name="rate"></CmsdsTextField>
    </div>
  );
};
