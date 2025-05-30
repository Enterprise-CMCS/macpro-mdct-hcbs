import React, { useEffect, useState } from "react";
import { Divider, Heading, Stack } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { TextField as CmsdsTextField } from "@cmsgov/design-system";
import { ElementType, NdrFieldsTemplate } from "types";
import { parseNumber, roundTo } from "../calculations";
import { PageElementProps } from "components/report/Elements";

export const NDRFields = (props: PageElementProps<NdrFieldsTemplate>) => {
  const { disabled, formkey, element } = props;
  const {
    labelTemplate,
    assessments,
    answer,
    multiplier = 1,
    fields,
  } = element;

  const defaultRates = assessments.map((assess) => {
    return {
      id: assess.id,
      label: assess.label,
      denominator: undefined,
      rates: fields.map((field) => {
        return {
          id: `${assess.id}.${field.id}`,
          numerator: undefined,
          rate: undefined,
          performanceTarget: undefined,
        };
      }),
    };
  });

  const defaultValue = answer ?? defaultRates;
  const [displayValue, setDisplayValue] = useState(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${formkey}.answer`;
  useEffect(() => {
    form.register(key, { required: true });
    form.setValue(key, defaultValue);
  }, []);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldType: "performanceTarget" | "denominator" | "numerator",
    assessIndex: number,
    rateIndex?: number
  ) => {
    const newValue = parseNumber(event.target.value);
    if (newValue === undefined) return;

    const answer = structuredClone(displayValue);

    switch (fieldType) {
      case "performanceTarget":
        answer[assessIndex].rates[rateIndex!].performanceTarget = newValue;
        break;
      case "denominator":
        answer[assessIndex].denominator = newValue;

        for (let rateObject of answer[assessIndex].rates) {
          const numerator = rateObject.numerator;
          if (numerator !== undefined && newValue !== 0) {
            rateObject.rate = roundTo(numerator / newValue, 1) * multiplier;
          }
        }
        break;
      case "numerator":
        {
          const denominator = answer[assessIndex].denominator;
          const rateObject = answer[assessIndex].rates[rateIndex!];
          rateObject.numerator = newValue;

          if (denominator !== undefined && denominator !== 0) {
            rateObject.rate = roundTo(newValue / denominator, 1) * multiplier;
          }
        }
        break;
    }

    setDisplayValue(answer);
    form.setValue(`${key}`, answer, { shouldValidate: true });
    form.setValue(`${key}.type`, ElementType.NdrFields);
  };

  return (
    <Stack gap={4} sx={sx.performance}>
      <Heading variant="subHeader">Performance Rates</Heading>
      <Stack gap="2rem">
        {assessments.map((assess, assessIndex) => {
          const rateSet = displayValue[assessIndex];

          return (
            <Stack key={assess.id} gap="2rem">
              <Heading variant="subHeader">
                {"Performance Rates: "}
                {assess.label}
              </Heading>

              <CmsdsTextField
                label={`Denominator (${assess.label})`}
                name={`${assessIndex}.denominator`}
                onChange={(evt) =>
                  onChangeHandler(evt, "denominator", assessIndex)
                }
                value={rateSet.denominator ?? ""}
                disabled={disabled}
              ></CmsdsTextField>

              {fields.map((field, fieldIndex) => {
                const rateObject = rateSet.rates[fieldIndex];

                return (
                  <Stack key={`${assess.id}.${field.id}`} gap="2rem">
                    <Heading variant="nestedHeading">{field.label}</Heading>
                    <CmsdsTextField
                      label={labelTemplate
                        .replace("{{field}}", field.label.toLowerCase())
                        .replace("{{assessment}}", assess.label)}
                      name={`${assessIndex}.rates.${fieldIndex}.performanceTarget`}
                      onChange={(evt) =>
                        onChangeHandler(
                          evt,
                          "performanceTarget",
                          assessIndex,
                          fieldIndex
                        )
                      }
                      value={rateObject.performanceTarget ?? ""}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Numerator: ${field.label} (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.numerator`}
                      onChange={(evt) =>
                        onChangeHandler(
                          evt,
                          "numerator",
                          assessIndex,
                          fieldIndex
                        )
                      }
                      value={rateObject.numerator ?? ""}
                      disabled={disabled}
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`Denominator (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.denominator`}
                      value={rateSet.denominator ?? ""}
                      disabled
                    ></CmsdsTextField>
                    <CmsdsTextField
                      label={`${field.label} Rate (${assess.label})`}
                      name={`${assessIndex}.rates.${fieldIndex}.rate`}
                      hint="Auto-calculates"
                      value={rateObject.rate ?? ""}
                      disabled
                    ></CmsdsTextField>
                  </Stack>
                );
              })}
              <Divider></Divider>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

const sx = {
  performance: {
    input: {
      width: "240px",
    },
  },
};
