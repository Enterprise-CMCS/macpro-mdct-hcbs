import { ModalBody, ModalFooter, Button } from "@chakra-ui/react";
import React, { ReactNode } from "react";

export const MeasureClearModal = (
  measureId: string,
  onClose: Function,
  onSubmit: Function
): ReactNode => {
  const submitReset = () => {
    onSubmit();
    onClose();
  };
  const body = `This action cannot be undone. It will clear all data that has been entered into the measure ${measureId} and reset this measure's status to 'Not started'`;
  return (
    <React.Fragment>
      <ModalBody>{body}</ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" mr={3} onClick={() => submitReset()}>
          Clear measure data
        </Button>
        <Button variant="link" onClick={() => onClose()}>
          Cancel
        </Button>
      </ModalFooter>
    </React.Fragment>
  );
};
