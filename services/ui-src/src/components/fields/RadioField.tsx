import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { useFormContext } from "react-hook-form";
import { ChoiceTemplate, RadioTemplate } from "types";
import { parseCustomHtml, useStore } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Page } from "components/report/Page";

export const formatChoices = (choices: ChoiceTemplate[], answer?: string) => {
  return choices.map((choice) => {
    const formatFields = choice?.checkedChildren ? (
      <Box sx={sx.children}>
        <Page elements={choice?.checkedChildren} />
      </Box>
    ) : (
      <></>
    );
    return {
      ...choice,
      checked: choice.value === answer,
      checkedChildren: [formatFields],
    };
  });
};

export const RadioField = (props: PageElementProps) => {
  const { userIsEndUser } = useStore().user || {};

  const radio = props.element as RadioTemplate;
  const [displayValue, setDisplayValue] = useState<ChoiceTemplate[]>(
    formatChoices(radio.value, radio.answer) ?? []
  );

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
        disabled={!userIsEndUser}
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
  },
};
