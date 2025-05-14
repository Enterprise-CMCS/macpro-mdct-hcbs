import React, { useState } from "react";
import { Modal, TextField, DropdownField } from "components";
import { Spinner, Flex, Text } from "@chakra-ui/react";
import { ElementType, Report } from "types";
import { createReport, putReport } from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
import {
  assertExhaustive,
  isReportType,
  ReportOptions,
  ReportStatus,
  ReportType,
} from "types/report";
import { QmsOptions } from "./AddFormOptions/QmsOptions";
import { TaOptions } from "./AddFormOptions/TaOptions";
import { CiOptions } from "./AddFormOptions/CiOptions";

export type AddEditReportModalOptions = {
  verbiage: {
    reportName: string;
    yearSelect: string;
    shortName: string;
    sampleName: string;
  };
  reportOptions: {
    [key: string]: any;
  };
  optionsElements: React.ReactNode;
  parseFormDataOptions: (formData: any) => { [key: string]: any };
};

const buildModalOptions = (
  reportType: ReportType,
  selectedReport: Report | undefined
): AddEditReportModalOptions => {
  switch (reportType) {
    case ReportType.QMS:
      return QmsOptions(selectedReport);
    case ReportType.TA:
      return TaOptions();
    case ReportType.CI:
      return CiOptions();
    default:
      assertExhaustive(reportType);
      return {
        verbiage: {
          reportName: "",
          yearSelect: "",
          shortName: "",
          sampleName: "",
        },
        reportOptions: {},
        optionsElements: undefined,
        parseFormDataOptions: () => ({}),
      };
  }
};

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  selectedReport,
  reportHandler,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const readOnly = selectedReport?.status === ReportStatus.SUBMITTED;
  const dropdownYears = [{ label: "2026", value: "2026" }];

  // add validation to formJson
  if (!isReportType(reportType)) return null;
  const { verbiage, reportOptions, optionsElements, parseFormDataOptions } =
    buildModalOptions(reportType, selectedReport);

  const form = useForm({
    defaultValues: {
      name: selectedReport?.name,
      year: selectedReport?.year,
      ...reportOptions,
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
        options: parseFormDataOptions(formData),
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
        heading: `${selectedReport ? "Edit" : "Add new"} ${
          verbiage.reportName
        }`,
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
                label: `${verbiage.reportName} Name`,
                helperText: `Name the ${verbiage.shortName} report so you can easily refer to it. Consider using timeframe(s). Sample Report Name: ${activeState} ${verbiage.sampleName}`,
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
                label: verbiage.yearSelect,
                options: dropdownYears,
                answer: selectedReport?.year.toString(),
                required: true,
                helperText:
                  "This is the final year in a multi-year reporting period, used to indicate the endpoint of data collection.  For example, if a report covers the period of 2025 and 2026, the reporting year would be 2026.",
              }}
              disabled={!!selectedReport}
              formkey={"year"}
            />
            {optionsElements}
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
