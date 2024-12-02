import { useState } from "react";
import { Modal, TextField } from "components";
import { Spinner, Flex, Button } from "@chakra-ui/react";
import { AnyObject, ElementType } from "types";
import { createReport } from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
//import { useNavigate } from "react-router-dom";

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  //const navigate = useNavigate();

  // add validation to formJson
  const form = useForm();

  const onSubmit = async (formData: any) => {
    //console.log("submitting");
    setSubmitting(true);

    const reportOptions = [];

    if (formData["reportTitle"]) {
      reportOptions.push(formData["reportTitle"].answer);
    }

    await createReport(reportType, activeState, reportOptions);

    setSubmitting(false);
    modalDisclosure.onClose();
    //navigate(`${activeState}/${report.id}`);
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
      <FormProvider {...form}>
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
      </FormProvider>
      <Flex>
        <Button form="addEditReportModal" type="submit">
          {submitting ? <Spinner size="md" /> : "Submit"}
        </Button>
      </Flex>
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
