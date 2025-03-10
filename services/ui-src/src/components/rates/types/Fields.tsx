import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const Fields = (
  props: PerformanceRateTemplate & { formkey: string }
) => {
  const { id, rateCalc, answer } = props;

  return (
    <Stack gap={4}>
      <CmsdsTextField
        label="Count of Successful Discharges to Community"
        name="numerator"
      ></CmsdsTextField>
      <CmsdsTextField label="Denominator" name="denominator"></CmsdsTextField>
      <CmsdsTextField label="Rate" name="rate" disabled></CmsdsTextField>
    </Stack>
  );
};
