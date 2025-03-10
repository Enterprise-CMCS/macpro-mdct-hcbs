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
        label="Field 1"
        name="Field 1"
      ></CmsdsTextField>
      <CmsdsTextField label="Field 2" name="Field 2"></CmsdsTextField>
      <CmsdsTextField label="Field 3" name="Field 3" disabled></CmsdsTextField>
    </Stack>
  );
};
