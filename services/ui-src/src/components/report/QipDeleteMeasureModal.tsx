import { ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const QipDeleteMeasureModal = (
  measureName: string,
  onClose: () => void,
  onConfirm: () => void
): ReactNode => {
  return (
    <>
      <ModalBody>
        <Text>
          This action cannot be undone. It will remove the measure {measureName}{" "}
          from this QI Plan.
        </Text>
      </ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" onClick={onConfirm}>
          Remove measure
        </Button>
        <Button variant="link" fontWeight="bold" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
