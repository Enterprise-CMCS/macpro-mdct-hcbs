import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { FieldError, useFormContext } from "react-hook-form";
import { ChoiceTemplate, RadioTemplate } from "types";
import { parseCustomHtml } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Page } from "components/report/Page";
import { ChoiceProps } from "@cmsgov/design-system/dist/types/ChoiceList/ChoiceList";

export const formatChoices = (
  parentKey: string,
  choices: ChoiceTemplate[],
  answer?: string
): ChoiceProps[] => {
  return choices.map((choice, choiceIndex) => {
    if (!choice?.checkedChildren) {
      return {
        ...choice,
        checked: choice.value === answer,
        checkedChildren: [],
      };
    }

    const children = choice.checkedChildren.map((child, childIndex) => ({
      ...child,
      formKey: `${parentKey}.value.${choiceIndex}.checkedChildren.${childIndex}`,
    }));

    const checkedChildren = [
      <Box sx={sx.children}>
        <Page elements={children} />
      </Box>,
    ];

    return {
      ...choice,
      checkedChildren,
      checked: choice.value === answer,
    };
  });
};

export const RadioField = (props: PageElementProps) => {
  const radio = props.element as RadioTemplate;

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    const options = { required: radio.required || false };
    form.register(key, options);
  }, []);

  const [displayValue, setDisplayValue] = useState<ChoiceProps[]>(
    formatChoices(`${props.formkey}`, radio.value, radio.answer) ?? []
  );

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
  const elementErrors = formErrorState?.[props.formkey] as {
    answer: FieldError;
  };
  const errorMessage = elementErrors?.answer?.message;
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

const sx = {
  children: {
    padding: "0 22px",
    border: "4px #0071BC solid",
    borderWidth: "0 0 0 4px",
    margin: "0 14px",
    input: {
      width: "240px",
    },
    textarea: {
      width: "440px",
    },
  },
};
