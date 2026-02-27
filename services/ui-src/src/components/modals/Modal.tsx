import { ReactNode } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import closeIcon from "assets/icons/close/icon_close_primary.svg";
import { useBreakpoint } from "utils";

export const Modal = ({
  modalDisclosure,
  content,
  onConfirmHandler,
  submitting,
  formId,
  children,
  disableConfirm,
}: Props) => {
  const { isMobile } = useBreakpoint();

  return (
    <ChakraModal
      isOpen={modalDisclosure.isOpen}
      onClose={modalDisclosure.onClose}
      preserveScrollBarGap={true}
      size={isMobile ? "sm" : "md"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h1" sx={sx.modalHeaderText}>
            {content.heading}
          </Heading>
        </ModalHeader>
        {content.subheading && <Box>{content.subheading}</Box>}
        <Flex sx={sx.modalCloseContainer}>
          <Button
            leftIcon={<Image src={closeIcon} alt="Close" />}
            variant="link"
            onClick={modalDisclosure.onClose}
            fontWeight="bold"
          >
            Close
          </Button>
        </Flex>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          {formId && (
            <Button
              sx={sx.action}
              form={formId}
              type="submit"
              data-testid="modal-submit-button"
              disabled={disableConfirm}
            >
              {submitting ? <Spinner size="md" /> : content.actionButtonText}
            </Button>
          )}
          {onConfirmHandler && (
            <Button
              sx={sx.action}
              onClick={() => onConfirmHandler()}
              data-testid="modal-submit-button"
              disabled={disableConfirm}
            >
              {submitting ? <Spinner size="md" /> : content.actionButtonText}
            </Button>
          )}
          {content.closeButtonText && (
            <Button
              sx={sx.close}
              variant="link"
              onClick={modalDisclosure.onClose}
              fontWeight="bold"
            >
              {content.closeButtonText}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: () => void;
  };
  content: {
    heading: string;
    subheading?: string;
    actionButtonText: string | ReactNode;
    closeButtonText?: string;
  };
  submitting?: boolean;
  onConfirmHandler?: () => void;
  disableConfirm?: boolean;
  formId?: string;
  children?: ReactNode;
}

const sx = {
  modalHeaderText: {
    fontSize: "heading_2xl",
    fontWeight: "heading_2xl",
  },
  modalCloseContainer: {
    position: "absolute",
    right: "spacer4",
  },
  action: {
    minWidth: "10rem",
    span: {
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "body_sm",
    },
  },
  close: {
    padding: "0 spacer2",
    ".mobile &": {
      fontSize: "body_sm",
      marginRight: "0",
    },
  },
};
