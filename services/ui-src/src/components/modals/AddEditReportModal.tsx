import { useState } from "react";
import { Modal, TextField } from "components";
import { Spinner, Flex } from "@chakra-ui/react";
import { ElementType, Report } from "types";
import { createReport, putReport } from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
import { ReportOptions } from "types/report";

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  selectedReport,
  reportHandler,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  // add validation to formJson
  const form = useForm();

  const onSubmit = async (formData: any) => {
    setSubmitting(true);

    const userEnteredReportName = formData?.reportTitle?.answer;

    if (selectedReport) {
      if (userEnteredReportName) {
        selectedReport.name = userEnteredReportName;
      }
      await putReport(selectedReport);
    } else {
      const reportOptions: ReportOptions = {
        name: "",
      };
      if (userEnteredReportName) {
        reportOptions.name = userEnteredReportName;
      }
      await createReport(reportType, activeState, reportOptions);
      await reportHandler(reportType, activeState);
    }

    setSubmitting(false);
    modalDisclosure.onClose();
  };

  return (
    <Modal
      data-testid="add-edit-report-modal"
      formId="addEditReportModal"
      modalDisclosure={modalDisclosure}
      content={{
        heading: `${
          selectedReport ? "Edit" : "Add new"
        } Quality Measure Set Report`,
        subheading: "",
        actionButtonText: submitting ? (
          <Spinner size="md" />
        ) : (
          `${selectedReport ? "Save" : "Start new"}`
        ),
        closeButtonText: "Cancel",
      }}
    >
      <FormProvider {...form}>
        <form id="addEditReportModal" onSubmit={form.handleSubmit(onSubmit)}>
          <Flex>
            <TextField
              element={{
                type: ElementType.Textbox,
                label: "QMS report name",
                helperText:
                  "Name this QMS report so you can easily refer to it. Consider using timeframe(s).",
                answer: selectedReport?.name,
              }}
              formkey={"reportTitle"}
            />
          </Flex>
        </form>
      </FormProvider>
    </Modal>
  );
};

interface Props {
  activeState: string;
  reportType: string;
  selectedReport?: Report;
  modalDisclosure: {
    isOpen: boolean;
    onClose: any;
  };
  reportHandler: (reportType: string, activeState: string) => void;
}
