import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { FieldError, useFormContext } from "react-hook-form";
import { ChoiceTemplate, RadioTemplate } from "types";
import { parseCustomHtml } from "utils";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Page } from "components/report/Page";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";

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
    form.setValue(key, radio.answer);
    form.register(key, options);
  }, []);

  const [displayValue, setDisplayValue] = useState<ChoiceProps[]>([]);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(`${props.formkey}`, radio.value, radio.answer) ?? []
    );
  }, [radio.answer]);

  // OnChange handles setting the visual of the radio on click, outside the normal blur
  const onChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newValues = displayValue.map((choice) => {
      choice.checked = choice.value === value;
      return choice;
    });
    setDisplayValue(newValues);
    /**
     * This is not ideal but we need to unregister the current radio
     * element before setting the again values.
     * There is (seemingly) a bug in react hook form with yup validation:
     *
     * If a child of a radio choice has errors and then
     * the child element gets cleared from the page by switching to
     * radio option that doesn't have children, the children errors do
     * not get cleared from the form and it breaks so we have to clear here
     * manually by doing unregister.
     *
     * If there's a bug with saving radio values, it's probably this line.
     */
    form.unregister(props.formkey);
    form.setValue(name, value, { shouldValidate: true });
    form.setValue(`${props.formkey}.type`, radio.type);
    form.setValue(`${props.formkey}.label`, radio.label);
  };

  const onBlurHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(key, event.target.value, { shouldValidate: true });
    form.setValue(`${props.formkey}.type`, radio.type);
    form.setValue(`${props.formkey}.label`, radio.label);
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
