import { ModalBody, ModalFooter, Button, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export const QipDeleteMeasureModal = (
  body: string,
  confirmLabel: string,
  onClose: () => void,
  onConfirm: () => void
): ReactNode => {
  return (
    <>
      <ModalBody>
        <Text>{body}</Text>
      </ModalBody>
      <ModalFooter gap="4">
        <Button colorScheme="blue" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="link" fontWeight="bold" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </>
  );
};
