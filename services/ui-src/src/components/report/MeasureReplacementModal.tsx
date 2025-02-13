import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import React from "react";
import { ChoiceList } from "@cmsgov/design-system";

const choices = [
  {
    label: "Yes",
    value: "yes",
  },
  {
    label: "No",
    value: "no",
  },
];

export const MeasureReplacementModal = (
  cmit: number | undefined,
  onClose: Function,
  onSubmit: Function
): React.ReactFragment => {
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log(name, value);
  };

  const measureCurr = "FASI-1";
  const measureSub = "LTSS-1";
  const label = `Do you want to substitute ${measureCurr} for ${measureSub}`

  return (
    <React.Fragment>
      <ModalBody>
        [hint text explaining what happens when substituting a measure]
        <ChoiceList
          name={"subsitute"}
          type={"radio"}
          label={label}
          choices={choices}
          onChange={onChangeHandler}
        />
      </ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" mr={3} onClick={() => onSubmit(false)}>
          Substitute Measure
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};
