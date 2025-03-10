import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { PerformanceRateTemplate } from "types";

export const NDR = (props: PerformanceRateTemplate & { formkey: string }) => {
  const { id, rateCalc, answer } = props;

  const templateYear = "2026";

  const categories = [
    { id: "test", label: "test" },
  ];

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // setDisplayValue(value);
    // form.setValue(name, value, { shouldValidate: true });
    // form.setValue(`${props.formkey}.type`, textbox.type);
    // form.setValue(`${props.formkey}.label`, textbox.label);
  };
  const onBlurHandler = () => {};

  return (
    <Stack gap={4}>
      {categories.map((cat) => (
        <>
          <Heading variant="subHeader">Performance Rate: {cat.label}</Heading>
          <CmsdsTextField
            label={`What is the ${templateYear} state performance target for this assessment`}
            name="numerator"
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
          ></CmsdsTextField>
          <CmsdsTextField label="Numerator" name="numerator"></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            name="denominator"
          ></CmsdsTextField>
          <CmsdsTextField
            label="Rate"
            name="rate"
            hint="Auto-calculates"
            disabled
          ></CmsdsTextField>
        </>
      ))}
    </Stack>
  );
};
