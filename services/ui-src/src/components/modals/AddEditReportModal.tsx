import { useState } from "react";
import { Modal, TextField } from "components";
import { Spinner, Flex } from "@chakra-ui/react";
import { AnyObject, ElementType } from "types";
import {
  createReport,
  getReportsForState,
} from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
import { ReportOptions } from "types/report";

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

    const reportOptions: any = {
      name: "",
    } as ReportOptions;

    if (formData["reportTitle"]) {
      reportOptions["name"] = formData["reportTitle"].answer;
    }

    await createReport(reportType, activeState, reportOptions);

    await getReportsForState(reportType, activeState);
    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId="addEditReportModal"
      modalDisclosure={modalDisclosure}
      content={{
        heading: "Add new Quality Measure Set Report",
        subheading: "",
        actionButtonText: submitting ? <Spinner size="md" /> : "Start new",
        closeButtonText: "Cancel",
      }}
    >
      <FormProvider {...form}>
        <form id="addEditReportModal" onSubmit={form.handleSubmit(onSubmit)}>
          <Flex>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "QMS Report Name",
                helperText:
                  "Name this QMS report so you can easily refer to it. Consider using timeframe(s)",
              }}
              formkey={"reportTitle"}
            ></TextField>
          </Flex>
        </form>
      </FormProvider>
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
