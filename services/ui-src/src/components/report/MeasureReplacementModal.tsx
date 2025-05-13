import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { ChoiceList } from "@cmsgov/design-system";
import { MeasurePageTemplate } from "types";

export const MeasureReplacementModal = (
  measure: MeasurePageTemplate,
  onClose: Function,
  onSubmit: Function
): ReactNode => {
  let selectMeasure: MeasurePageTemplate | undefined;

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectMeasure = event.target.value === "0" ? measure : undefined;
  };

  const label = `Do you want to substitute ${measure.substitutable} for ${measure.id} ?`;

  return (
    <React.Fragment>
      <ModalBody>
        You can substitute an optional measure for the original. The new measure
        will now appear on the Required Measure Results page, and the original
        will now appear on the Optional Measure Results page.
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
