import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { FieldError, useFormContext } from "react-hook-form";
import { ReportingRadioTemplate } from "types";
import { parseCustomHtml, useStore } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { formatChoices } from "./RadioField";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";
import { requiredResponse } from "../../constants";

export const ReportingRadioField = (props: PageElementProps) => {
  const radio = props.element as ReportingRadioTemplate;
  const { clearMeasure, saveReport, currentPageId } = useStore();

  const [displayValue, setDisplayValue] = useState<ChoiceProps[]>([]);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(`${props.formkey}`, radio.choices, radio.answer) ?? []
    );
  }, [radio.answer]);

  // get form context and register field
  const form = useFormContext();
  const key = `${props.formkey}.answer`;
  useEffect(() => {
    const options = { required: radio.required ? requiredResponse : false };
    form.register(key, options);
    form.setValue(`${props.formkey}.id`, radio.id);
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
    form.setValue(`${props.formkey}.type`, radio.type);
    form.setValue(`${props.formkey}.label`, radio.label);
    form.setValue(`${props.formkey}.id`, radio.id);

    if (value === "no") {
      clearMeasure(currentPageId ?? "", [radio.id]);
      saveReport();
      return;
    }
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value);
    form.setValue(`${props.formkey}.type`, radio.type);
    form.setValue(`${props.formkey}.label`, radio.label);
    form.setValue(`${props.formkey}.id`, radio.id);
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

/*
 * const sx = {
 *   children: {
 *     padding: "0 22px",
 *     border: "4px #0071BC solid",
 *     borderWidth: "0 0 0 4px",
 *     margin: "0 14px",
 *   },
 * };
 */
