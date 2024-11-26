import { useState } from "react";
import { Modal, TextField } from "components";
import { Spinner, Flex } from "@chakra-ui/react";
import { AnyObject, ElementType } from "types";

export const AddEditReportModal = ({ modalDisclosure }: Props) => {
  const [submitting] = useState<boolean>(false);

  return (
    <Modal
      data-testid="add-edit-report-modal"
      modalDisclosure={modalDisclosure}
      content={{
        heading: "",
        subheading: "",
        actionButtonText: submitting ? <Spinner size="md" /> : "Save",
        closeButtonText: "Cancel",
      }}
    >
      <form
        id="addEditReportModal"
        //onSubmit={form.handleSubmit(onSubmit)}
      >
        <Flex flexDirection="column" gap="1.5rem">
          <TextField
            element={{
              type: ElementType.Textbox,
              label: "Title text",
            }}
            formkey={"reportTitle"}
          ></TextField>
        </Flex>
      </form>
    </Modal>
  );
};

interface Props {
  activeState: string;
  reportType: string;
  selectedReport?: AnyObject;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
}
