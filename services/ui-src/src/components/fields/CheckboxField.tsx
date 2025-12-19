import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { useState } from "react";
import { CheckboxTemplate, ChoiceTemplate } from "types";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";

const formatChoices = (
  choices: ChoiceTemplate[],
  answer: string[] | undefined
): ChoiceProps[] => {
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
  const initialDisplayValue = formatChoices(checkbox.choices, checkbox.answer);
  const [displayValue, setDisplayValue] = useState(initialDisplayValue);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (checkbox.answer?.includes(value))
      checkbox.answer = checkbox.answer.filter((id) => id != value);
    else checkbox.answer?.push(value);

    const newDisplayValue = formatChoices(checkbox.choices, checkbox.answer);
    setDisplayValue(newDisplayValue);
    props.updateElement({ answer: checkbox.answer });
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
