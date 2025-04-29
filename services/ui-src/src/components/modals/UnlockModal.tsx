import { Modal } from "components";

export const UnlockModal = ({ modalDisclosure }: Props) => {
  return (
    <Modal
      data-testid="unlock-modal"
      formId="UnlockModal"
      modalDisclosure={modalDisclosure}
      content={{
        heading: "You unlocked this QMS Report",
        subheading: undefined,
        actionButtonText: "Return to dashboard",
        closeButtonText: undefined,
      }}
    ></Modal>
  );
};

interface Props {
  selectedReport?: Report;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
