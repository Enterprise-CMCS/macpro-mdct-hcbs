import {
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import React from "react";

export const MeasureReplacementModal = (
  cmit: number | undefined,
  onClose: Function,
  onSubmit: Function
): React.ReactFragment => {
  return (
    <React.Fragment>
      <ModalBody>
        Select alternate measure type for CMIT {cmit}
        {/* @ts-ignore TODO */}
        <RadioGroup onChange={() => {}} value={1}>
          <Stack direction="column">
            <Radio value="1">Measure Type One</Radio>
            <Radio value="2">Measure Type Two</Radio>
          </Stack>
        </RadioGroup>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={() => onSubmit(false)}>
          Select Measure
        </Button>
        <Button variant="ghost" onClick={() => onClose(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};
