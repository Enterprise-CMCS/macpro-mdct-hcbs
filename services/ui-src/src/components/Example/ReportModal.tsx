import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useStore } from "utils";

/*
 * Original implementation. We can probably set it up to take an id as an alternate invocation
 * interface Props {
 *   elements: PageElement[];
 *   isOpen: boolean;
 *   onClose: any;
 * }
 * If modalElements, render as below, if id, use <Page>
 */

export const ReportModal = () => {
  const { modalOpen, modalComponent, setModalOpen } = useStore();
  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <ModalOverlay />
      <ModalContent width="500px" minWidth="500px">
        <ModalCloseButton />
        {modalComponent}
      </ModalContent>
    </Modal>
  );
};
