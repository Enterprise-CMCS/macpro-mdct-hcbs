import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { useFormContext } from "react-hook-form";
import { ChoiceTemplate, ElementType, RadioTemplate } from "types";
import { parseCustomHtml } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { TextField } from "components";

export const formatChoices = (choices: ChoiceTemplate[]) => {
  return choices.map((choice) => {
    if (choice.children) {
      const formatFields = choice.children.map((element) => {
        if (element.type === ElementType.Textbox) {
          return (
            <TextField
              element={{
                type: ElementType.Textbox,
                label: element.label,
              }}
              formkey={element.label}
            ></TextField>
          );
        }
        return <>Not Found</>;
      });
      return { ...choice, children: formatFields };
    }
    return choice;
  });
};

export const RadioField = (props: PageElementProps) => {
  const radio = props.element as RadioTemplate;

  const defaultValue = formatChoices(radio.value) ?? [];
  const [displayValue, setDisplayValue] =
    useState<ChoiceTemplate[]>(defaultValue);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    form.register(key);
  }, []);

  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newValues = displayValue.map((choice) => {
      choice.checked = choice.value === value;
      return choice;
    });
    setDisplayValue(newValues);
    form.setValue(name, value, { shouldValidate: true });
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
  };

  // prepare error message, hint, and classes
  const formErrorState = form?.formState?.errors;
  const errorMessage = formErrorState?.[key]?.message;
  const parsedHint = radio.helperText && parseCustomHtml(radio.helperText);
  const labelText = radio.label;

  return (
    <Box>
      <CmsdsChoiceList
        name={key}
        type={"radio"}
        label={labelText || ""}
        choices={displayValue}
        hint={parsedHint}
        errorMessage={errorMessage}
        onChange={onChangeHandler}
        onComponentBlur={onBlurHandler}
        {...props}
      />
    </Box>
  );
};
