import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PerformanceRateTemplate } from "types";
import { AnyObject } from "yup";

export const NDR = (props: PerformanceRateTemplate & { formkey: string }) => {
  const { id, rateCalc, categories, answer } = props;
  const defaultValue = answer ?? {
    numerator: "",
    denominator: "",
    rate: "",
    performanceTarget: "",
  };
  const [displayValue, setDisplayValue] = useState<AnyObject>(defaultValue);

  const templateYear = "2026";

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newDisplayValue = {
      ...displayValue,
      [name]: value,
    };

    setDisplayValue(newDisplayValue);
    form.setValue(name, newDisplayValue, { shouldValidate: true });
    // form.setValue(`${props.formkey}.type`, textbox.type);
    // form.setValue(`${props.formkey}.label`, textbox.label);
  };
  const onBlurHandler = () => {};

  return (
    <Stack gap={4}>
      {categories?.map((cat) => (
        <>
          <Heading variant="subHeader">Performance Rate: {cat.label}</Heading>
          <CmsdsTextField
            label={`What is the ${templateYear} state performance target for this assessment`}
            name="performanceTarget"
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.performanceTarget}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Numerator"
            name="numerator"
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.numerator}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Denominator"
            name="denominator"
            onChange={onChangeHandler}
            onBlur={onBlurHandler}
            value={displayValue.denominator}
          ></CmsdsTextField>
          <CmsdsTextField
            label="Rate"
            name="rate"
            hint="Auto-calculates"
            value={displayValue.rate}
            disabled
          ></CmsdsTextField>
        </>
      ))}
    </Stack>
  );
};
