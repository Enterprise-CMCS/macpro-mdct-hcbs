import React, { useState } from "react";
import { ListInputTemplate } from "types";
import { PageElementProps } from "components/report/Elements";
import { Button, HStack, Image } from "@chakra-ui/react";
import { TextField } from "@cmsgov/design-system";
import cancelPrimary from "assets/icons/cancel/icon_cancel_primary.svg";
import addPrimary from "assets/icons/add/icon_add_blue.svg";

export const ListInput = (props: PageElementProps<ListInputTemplate>) => {
  const { label, fieldLabel, helperText, buttonText, answer } = props.element;
  const [displayValue, setDisplayValue] = useState(answer ?? []);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = event.target.value;
    const newDisplay = [...displayValue];
    newDisplay[index] = rawValue;
    setDisplayValue(newDisplay);
    props.updateElement({ answer: newDisplay });
  };

  const onAddHandler = () => {
    const newDisplay = [...displayValue];
    newDisplay.push("");
    setDisplayValue(newDisplay);
    props.updateElement({ answer: newDisplay });
  };

  const onRemoveHandler = (index: number) => {
    const newDisplay = [...displayValue];
    newDisplay.splice(index, 1);
    setDisplayValue(newDisplay);
    props.updateElement({ answer: newDisplay });
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
          ></TextField>
          <Button variant="unstyled" onClick={() => onRemoveHandler(index)}>
            <Image src={cancelPrimary} alt="Remove" />
          </Button>
        </HStack>
      ))}
      <Button
        mt="1rem"
        variant="outline"
        leftIcon={<Image src={addPrimary} alt="Add" />}
        onClick={onAddHandler}
      >
        {buttonText}
      </Button>
    </fieldset>
  );
};
