import { Heading, Stack } from "@chakra-ui/react";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { PerformanceRateTemplate } from "types";
import { AnyObject } from "yup";

export const NDR = (
  props: PerformanceRateTemplate & {
    formkey: string;
    year?: number;
    calculation: Function;
  }
) => {
  const { assessments, answer, multiplier, calculation } = props;
  const defaultValue =
    answer ??
    assessments?.map((assess) => {
      return {
        numerator: "",
        denominator: "",
        rate: "",
        performanceTarget: "",
        id: assess.id,
      };
    });

  const [displayValue, setDisplayValue] = useState<AnyObject[]>(defaultValue!);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const [index, type] = name.split(".");
    const multiply = multiplier ?? 1;

    const newDisplayValue = displayValue[Number(index)];
    newDisplayValue[type] = value;

    if (
      newDisplayValue.numerator != undefined &&
      newDisplayValue.denominator != undefined
    ) {
      newDisplayValue.rate = calculation(newDisplayValue);
      newDisplayValue.rate = newDisplayValue.rate * multiply;
    }

    displayValue[Number(index)] = newDisplayValue;
    setDisplayValue(displayValue);

    form.setValue(`${key}`, displayValue, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };
  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    form.setValue(`${key}.${name}`, value, { shouldValidate: true });
    form.setValue(`${key}.type`, props.type);
  };

  return (
    <Stack gap={4}>
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
