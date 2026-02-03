import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { PageElementProps } from "components/report/Elements";
import { CheckboxTemplate, ChoiceTemplate, PageElement } from "types";
import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { ChoiceProps } from "@cmsgov/design-system/dist/react-components/types/ChoiceList/ChoiceList";
import { Page } from "components/report/Page";

const formatChoices = (
  choices: ChoiceTemplate[],
  answer: string[],
  updateElement: (element: Partial<CheckboxTemplate>) => void
): ChoiceProps[] => {
  return choices.map((choice, choiceIndex) => {
    if (!choice.checkedChildren) {
      return {
        ...choice,
        checked: answer?.includes(choice.value),
        checkedChildren: [],
      };
    }

    const setCheckedChildren = (checkedChildren: PageElement[]) => {
      updateElement({
        choices: [
          ...choices.slice(0, choiceIndex),
          { ...choice, checkedChildren },
          ...choices.slice(choiceIndex + 1),
        ],
      });
    };

    const checkedChildren = [
      <Box key="checkbox-sub-page" sx={sx.children}>
        <Page
          id="checkbox-children"
          setElements={setCheckedChildren}
          elements={choice.checkedChildren}
        />
      </Box>,
    ];

    return {
      ...choice,
      checkedChildren,
      checked: answer?.includes(choice.value),
    };
  });
};

export const CheckboxField = (props: PageElementProps<CheckboxTemplate>) => {
  const checkbox = props.element;
  const initialDisplayValue = formatChoices(
    checkbox.choices,
    checkbox.answer ?? [],
    props.updateElement
  );
  const [displayValue, setDisplayValue] = useState(initialDisplayValue);

  // Need to listen to prop updates from the parent for events like a measure clear
  useEffect(() => {
    setDisplayValue(
      formatChoices(
        checkbox.choices,
        checkbox.answer ?? [],
        props.updateElement
      )
    );
  }, [checkbox.choices, checkbox.answer]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    let set = new Set(checkbox.answer ?? []);

    if (set.has(value)) set.delete(value);
    else set.add(value);

    const newValue = [...set];
    const newDisplayValue = formatChoices(
      checkbox.choices,
      newValue,
      props.updateElement
    );
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
};
