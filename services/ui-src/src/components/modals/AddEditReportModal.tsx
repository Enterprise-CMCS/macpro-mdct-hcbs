import React, { useState } from "react";
import { Modal, TextField, RadioField, DropdownField } from "components";
import { Spinner, Flex, Text } from "@chakra-ui/react";
import { ElementType, Report } from "types";
import { createReport, putReport } from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
import { ReportOptions, ReportStatus } from "types/report";

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  selectedReport,
  reportHandler,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const readOnly = selectedReport?.status === ReportStatus.SUBMITTED;
  // TO-DO to update when we add template versioning by year
  const dropdownYears = [{ label: "2026", value: "2026" }];

  // add validation to formJson
  const form = useForm({
    defaultValues: {
      name: selectedReport?.name,
      year: selectedReport?.year,
      cahps: selectedReport?.options.cahps,
      hciidd: selectedReport?.options.hciidd,
      nciad: selectedReport?.options.nciad,
      pom: selectedReport?.options.pom,
    },
    shouldUnregister: true,
  });
  const onSubmit = async (formData: any) => {
    setSubmitting(true);

    const userEnteredReportName = formData.reportTitle.answer;

    if (selectedReport) {
      if (userEnteredReportName) {
        selectedReport.name = userEnteredReportName;
      }
      await putReport(selectedReport);
    } else {
      const reportOptions: ReportOptions = {
        name: userEnteredReportName,
        year: Number(formData.year.answer),
        options: {
          cahps: formData.cahps.answer == "true",
          hciidd: formData.hciidd.answer == "true",
          nciad: formData.nciad.answer == "true",
          pom: formData.pom.answer == "true",
        },
      };
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
      disableConfirm={readOnly}
    >
      <FormProvider {...form}>
        <form id="addEditReportModal" onSubmit={form.handleSubmit(onSubmit)}>
          <Flex direction="column" gap="1.5rem">
            <Text>
              Answering “Yes” or “No” to the following questions will impact
              which measure results must be reported.
            </Text>
            <TextField
              element={{
                type: ElementType.Textbox,
                id: "",
                label: "Quality Measure Set Report Name",
                helperText:
                  "Name the QMS report so you can easily refer to it. Consider using timeframe(s). Sample Report Name: " +
                  activeState +
                  " HCBS QMS Report for 2026",
                answer: selectedReport?.name,
                required: true,
              }}
              disabled={readOnly}
              formkey={"reportTitle"}
            />
            <DropdownField
              element={{
                type: ElementType.Dropdown,
                id: "",
                label: "Select the quality measure set reporting year.",
                options: dropdownYears,
                answer: selectedReport?.year.toString(),
                required: true,
                helperText:
                  "This is the final year in a multi-year reporting period, used to indicate the endpoint of data collection.  For example, if a report covers the period of 2025 and 2026, the reporting year would be 2026.",
              }}
              disabled={!!selectedReport}
              formkey={"year"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                id: "",
                label:
                  "Is your state reporting on the HCBS CAHPS beneficiary Survey?",
                choices: [
                  {
                    label: "Yes",
                    value: "true",
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "false",
                    checked: false,
                  },
                ],
                required: true,
                answer: selectedReport?.options.cahps?.toString(),
              }}
              disabled={!!selectedReport}
              formkey={"cahps"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                id: "",
                label:
                  "Is your state reporting on the HCI-IDD beneficiary Survey?",
                choices: [
                  {
                    label: "Yes",
                    value: "true",
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "false",
                    checked: false,
                  },
                ],
                required: true,
                answer: selectedReport?.options.hciidd?.toString(),
              }}
              disabled={!!selectedReport}
              formkey={"hciidd"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                id: "",
                label:
                  "Is your state reporting on the NCI-AD beneficiary Survey?",
                choices: [
                  {
                    label: "Yes",
                    value: "true",
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "false",
                    checked: false,
                  },
                ],
                required: true,
                answer: selectedReport?.options.nciad?.toString(),
              }}
              disabled={!!selectedReport}
              formkey={"nciad"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                id: "",
                label: "Is your state reporting on the POM beneficiary Survey?",
                choices: [
                  {
                    label: "Yes",
                    value: "true",
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "false",
                    checked: false,
                  },
                ],
                required: true,
                answer: selectedReport?.options.pom?.toString(),
              }}
              disabled={!!selectedReport}
              formkey={"pom"}
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
