import { Heading, Stack, Text } from "@chakra-ui/react";
import { get, useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useEffect, useState } from "react";
import { PerformanceRateTemplate } from "types";
import { AnyObject } from "yup";

export const NDREnhanced = (
  props: PerformanceRateTemplate & { formkey: string; year?: number }
) => {
  const { id, rateCalc, assessments, answer } = props;
  const defaultValue = answer ?? [];
  const [displayValue, setDisplayValue] = useState<AnyObject[]>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props?.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

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
        name="denominator"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      ></CmsdsTextField>
      {assessments?.map((assess, index) => {
        const value = displayValue.find((item) => item.id === assess.id) ?? {};
        return (
          <>
            <Heading variant="subHeader">
              Performance Rate: {assess.label}
            </Heading>
            <CmsdsTextField
              label={`What is the ${props.year} state performance target for this assessment`}
              name={`${index}.performanceTarget`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.performanceTarget}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Numerator"
              name={`${index}.numerator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.numerator}
            ></CmsdsTextField>
            <CmsdsTextField
              label="Denominator"
              name={`${index}.denominator`}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              value={value.denominator}
              hint="Auto-calculates"
              disabled
            ></CmsdsTextField>
            <CmsdsTextField
              label="Rate"
              name={`${index}.rate`}
              hint="Auto-calculates"
              value={value.rate}
              disabled
            ></CmsdsTextField>
          </>
        );
      })}
    </Stack>
  );
};
