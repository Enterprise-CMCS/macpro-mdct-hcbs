import {
  Button,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useStore } from "utils";
import closeIcon from "assets/icons/close/icon_close_primary.svg";

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
  const { modalOpen, modalHeader, modalComponent, setModalOpen } = useStore();
  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalHeader}</ModalHeader>
        <Button
          className="close"
          leftIcon={<Image src={closeIcon} alt="Close" />}
          variant="link"
          onClick={() => setModalOpen(false)}
        >
          Close
        </Button>
        {modalComponent}
      </ModalContent>
    </Modal>
  );
};
