import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useStore } from "utils";
import { PageElement } from "./types";

/* TODO: 
Original implementation. We can probably set it up to take an id as an alternate invocation
interface Props {
  elements: PageElement[];
  isOpen: boolean;
  onClose: any;
}

If modalElements, render as below, if id, use <Page>
*/

export const ReportModal = () => {
  const { modalOpen, modalArgs, setModalOpen } = useStore();
  const modalElements = modalArgs?.modalFunction(modalArgs.params);
  return (
    <Modal
      isOpen={modalOpen && !!modalArgs}
      onClose={() => setModalOpen(false)}
    >
      <ModalOverlay />
      <ModalContent width="500px" minWidth="500px">
        <ModalCloseButton />
        {modalElements}
      </ModalContent>
    </Modal>
  );
};
