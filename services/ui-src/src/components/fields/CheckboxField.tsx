import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { CheckboxTemplate, ChoiceTemplate } from "types";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";

const formatChoices = (choices: ChoiceTemplate[], answer: string[]) => {
  return choices.map((choice) => {
    return {
      ...choice,
      checkedChildren: [],
      checked: answer?.includes(choice.value),
    };
  });
};

export const CheckboxField = (props: PageElementProps<CheckboxTemplate>) => {
  const checkbox = props.element;
  const initialDisplayValue = formatChoices(
    checkbox.choices,
    checkbox.answer ?? []
  );
  const [displayValue, setDisplayValue] = useState(initialDisplayValue);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    let set = new Set(checkbox.answer ?? []);

    if (set.has(value)) set.delete(value);
    else set.add(value);

    const newValue = [...set];
    const newDisplayValue = formatChoices(checkbox.choices, newValue);
    setDisplayValue(newDisplayValue);
    props.updateElement({ answer: newValue });
  };

  const labelText = checkbox.label;

  return (
    <Box>
      <CmsdsChoiceList
        name={checkbox.id}
        type={"checkbox"}
        label={labelText || ""}
        choices={displayValue}
        hint={checkbox.helperText}
        onChange={onChangeHandler}
        {...props}
      />
    </Box>
  );
};
