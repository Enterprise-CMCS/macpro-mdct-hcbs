import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { Page } from "./Page";
import { PageElement } from "./types";

interface Props {
  elements: PageElement[];
  isOpen: boolean;
  onClose: any;
}

export const ReportModal = ({ elements, isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="500px">
      <ModalOverlay />
      <ModalContent width="500px" minWidth="500px">
        <ModalCloseButton />
        <ModalBody>
          <Page elements={elements}></Page>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3}>
            Select Measure
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
