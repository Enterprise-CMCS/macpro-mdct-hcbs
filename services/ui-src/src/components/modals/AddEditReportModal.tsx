import { useState } from "react";
import { Modal, TextField } from "components";
import { Spinner, Flex } from "@chakra-ui/react";
import { AnyObject, ElementType } from "types";
import { createReport } from "utils/api/requestMethods/report";
import { useForm } from "react-hook-form";

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form = useForm();

  const onSubmit = async (formData: any) => {
    setSubmitting(true);

    const reportOptions = [];

    if (formData["reportTitle"]) {
      reportOptions.push(formData["reportTitle"].answer);
    }

    await createReport(reportType, activeState, reportOptions);

    setSubmitting(false);
    modalDisclosure.onClose();
    //navigate(`${props.activeState}/${report.id}`);
  };

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
      <form id="addEditReportModal" onSubmit={form.handleSubmit(onSubmit)}>
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
