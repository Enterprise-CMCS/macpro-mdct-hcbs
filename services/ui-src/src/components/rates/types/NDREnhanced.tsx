import { Heading, Stack, Text } from "@chakra-ui/react";
import { get, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useEffect, useState } from "react";
import { PerformanceRateTemplate } from "types";
import { AnyObject } from "yup";

export const NDREnhanced = (
  props: PerformanceRateTemplate & { formkey: string }
) => {
  const { id, rateCalc, answer } = props;
  const defaultValue = answer ?? {};
  const [displayValue, setDisplayValue] = useState<AnyObject>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props?.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const categories = [
    { id: "test", label: "test" },
    { id: "test2", label: "test 2" },
  ];
  const templateYear = "2026";

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
      <CmsdsTextField
        label="Performance Rates Denominator"
        name="Performance Rates Denominator"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      ></CmsdsTextField>
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
            hint="Auto-calculates"
            disabled
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
