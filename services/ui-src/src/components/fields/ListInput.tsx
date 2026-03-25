import React, { useState } from "react";
import { ListInputTemplate } from "types";
import { PageElementProps } from "components/report/Elements";
import {
  Button,
  HStack,
  Image,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { TextField } from "@cmsgov/design-system";
import cancelPrimary from "assets/icons/cancel/icon_cancel_primary.svg";
import addPrimary from "assets/icons/add/icon_add_blue.svg";
import { ErrorMessages } from "../../constants";

export const ListInput = (props: PageElementProps<ListInputTemplate>) => {
  const { updateElement, disabled, element } = props;
  const { label, fieldLabel, helperText, buttonText, answer } = element;
  const [displayValue, setDisplayValue] = useState(answer ?? []);
  const [errorMessages, setErrorMessages] = useState([""]);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = event.target.value;
    const newDisplay = [...displayValue];
    newDisplay[index] = rawValue;
    setDisplayValue(newDisplay);

    const newErrorMessages = [...errorMessages];
    if (!rawValue) {
      newErrorMessages[index] = ErrorMessages.requiredResponse;
    } else {
      newErrorMessages[index] = "";
    }
    setErrorMessages(newErrorMessages);

    updateElement({ answer: newDisplay });
  };

  const onAddHandler = () => {
    const newDisplay = [...displayValue, ""];
    setDisplayValue(newDisplay);
    updateElement({ answer: newDisplay });
  };

  const onRemoveHandler = (index: number) => {
    const newDisplay = [...displayValue];
    newDisplay.splice(index, 1);
    setDisplayValue(newDisplay);
    updateElement({ answer: newDisplay });
  };

  return (
    <fieldset className="ds-c-fieldset" key="list-input-field">
      <legend className="ds-c-label">{label}</legend>
      <p className="ds-c-hint">{helperText} </p>
      {displayValue?.map((field, index) => (
        <HStack
          alignItems="flex-end"
          mt="1rem"
          key={`list-item-stack-${index}`}
        >
          <TextField
            key={`list-item-${index}`}
            name={`list-item-${index}`}
            label={fieldLabel}
            value={field}
            onChange={(evt) => onChangeHandler(evt, index)}
            onBlur={(evt) => onChangeHandler(evt, index)}
            errorMessage={errorMessages?.[index] ?? ""}
            disabled={disabled}
          ></TextField>
          <Button
            variant="unstyled"
            onClick={() => onRemoveHandler(index)}
            disabled={disabled}
            aria-label={`Remove ${field}`}
          >
            <Image src={cancelPrimary} alt="Remove" />
          </Button>
        </HStack>
      ))}
      <Button
        mt="1rem"
        variant="outline"
        leftIcon={<Image src={addPrimary} alt="Add" />}
        onClick={onAddHandler}
        disabled={disabled}
      >
        {buttonText}
      </Button>
    </fieldset>
  );
};

export const ListInputExport = (element: ListInputTemplate) => {
  if (!element.answer || element.answer.length === 0) {
    return <></>;
  }

  return (
    <UnorderedList sx={sx.checkboxExport}>
      {element.answer.map((item, i) => (
        <ListItem key={`list-item-${i}`}>{item}</ListItem>
      ))}
    </UnorderedList>
  );
};

const sx = {
  children: {
    padding: "0 22px",
    border: "4px #0071BC solid",
    borderWidth: "0 0 0 4px",
    margin: "0 14px",
    "input:not(.ds-c-choice)": {
      width: "240px",
    },
    textarea: {
      maxWidth: "440px",
    },
  },
  checkboxExport: {
    listStyleType: "none",
    marginLeft: 0,
    "& > li + li": {
      marginTop: 1,
    },
  },
};
