import { Modal } from "components";
import { Text } from "@chakra-ui/react";

export const UnlockModal = ({ modalDisclosure }: Props) => {
  return (
    <Modal
      data-testid="unlock-modal"
      modalDisclosure={modalDisclosure}
      onConfirmHandler={() => modalDisclosure.onClose()}
      content={{
        heading: "You unlocked this XYZ Report",
        subheading: undefined,
        actionButtonText: "Return to dashboard",
        closeButtonText: undefined,
      }}
    >
      <Text>
        Email the state or territory contact and let them know it requires
        edits.
      </Text>
    </Modal>
  );
};

interface Props {
  modalDisclosure: {
    isOpen: boolean;
    onClose: () => void;
  };
}
