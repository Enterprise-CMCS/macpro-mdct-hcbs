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

export const Modal = ({
  modalDisclosure,
  content,
  onConfirmHandler,
  submitting,
  formId,
  children,
  disableConfirm,
}: Props) => {
  return (
    <ChakraModal
      isOpen={modalDisclosure.isOpen}
      onClose={modalDisclosure.onClose}
      preserveScrollBarGap={true}
    >
      <ModalOverlay />
      <ModalContent sx={sx.modalContent}>
        <ModalHeader sx={sx.modalHeader}>
          <Heading as="h1" sx={sx.modalHeaderText}>
            {content.heading}
          </Heading>
        </ModalHeader>
        {content.subheading && (
          <Box sx={sx.modalSubheader}>{content.subheading}</Box>
        )}
        <Flex sx={sx.modalCloseContainer}>
          <Button
            sx={sx.modalClose}
            leftIcon={<Image src={closeIcon} alt="Close" sx={sx.closeIcon} />}
            variant="link"
            onClick={modalDisclosure.onClose}
            fontWeight="bold"
          >
            Close
          </Button>
        </Flex>
        <ModalBody sx={sx.modalBody}>{children}</ModalBody>
        <ModalFooter sx={sx.modalFooter}>
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
  modalContent: {
    boxShadow: ".125rem .125rem .25rem",
    borderRadius: "0",
    maxWidth: "30rem",
    marginX: "4rem",
    padding: "2rem",
  },
  modalHeader: {
    padding: "0",
    margin: "0 0 2rem 0",
  },
  modalHeaderText: {
    padding: "0 2rem 0 0",
    fontSize: "2xl",
    fontWeight: "bold",
  },
  modalSubheader: {
    margin: "0.5rem auto -1rem auto",
  },
  modalCloseContainer: {
    alignItems: "center",
    justifycontent: "center",
    flexShrink: "0",
    position: "absolute",
    top: "2rem",
    right: "2rem",
  },
  modalClose: {
    span: {
      margin: "0.25rem",
      paddingTop: "0.06rem",
      svg: {
        fontSize: "xs",
        width: "xs",
        height: "xs",
      },
    },
  },
  modalBody: {
    paddingX: "0",
    paddingY: "1rem",
  },
  modalFooter: {
    justifyContent: "flex-start",
    padding: "0",
    paddingTop: "2rem",
  },
  action: {
    justifyContent: "center",
    marginRight: "2rem",
    minWidth: "10rem",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
      "&.ds-c-spinner": {
        marginLeft: 0,
      },
    },
    ".mobile &": {
      fontSize: "sm",
    },
  },
  close: {
    justifyContent: "start",
    padding: ".5rem 1rem",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      fontSize: "sm",
      marginRight: "0",
    },
  },
  closeIcon: {
    width: "0.75rem",
  },
};
