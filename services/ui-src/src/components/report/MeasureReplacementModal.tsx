import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import React from "react";
import { ChoiceList } from "@cmsgov/design-system";
import { MeasurePageTemplate } from "types";

export const MeasureReplacementModal = (
  measure: MeasurePageTemplate,
  onClose: Function,
  onSubmit: Function
): React.ReactFragment => {
  let selectMeasure: MeasurePageTemplate | undefined;

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectMeasure = event.target.value === "0" ? measure : undefined;
  };

  const name = measure.title.split(":")[0];
  const label = `Do you want to substitute ${name} for ${measure.substitutable}`;

  return (
    <React.Fragment>
      <ModalBody>
        [hint text explaining what happens when substituting a measure]
        <ChoiceList
          name={"subsitute"}
          type={"radio"}
          label={label}
          choices={[
            {
              label: "Yes",
              value: 0,
            },
            {
              label: "No",
              value: 1,
            },
          ]}
          onChange={onChangeHandler}
        />
      </ModalBody>
      <ModalFooter gap="4">
        <Button
          colorScheme="blue"
          mr={3}
          onClick={() => onSubmit(selectMeasure)}
        >
          Substitute Measure
        </Button>
        <Button variant="link" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};
