import React, { useState } from "react";
import { Modal, TextField, RadioField } from "components";
import { Spinner, Flex, Text } from "@chakra-ui/react";
import { DropdownOptions, ElementType, Report } from "types";
import { createReport, putReport } from "utils/api/requestMethods/report";
import { FormProvider, useForm } from "react-hook-form";
import { ReportOptions } from "types/report";
import { Dropdown } from "@cmsgov/design-system";
import { Years } from "../../constants";

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  selectedReport,
  reportHandler,
}: Props) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("");

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };
  const buildYears = (): DropdownOptions[] => {
    const dropdownYears: DropdownOptions[] = Object.keys(Years).map(
      (value) => ({
        label: Years[value as unknown as keyof typeof Years],
        value,
      })
    );
    return [...dropdownYears];
  };

  const dropdownYears = buildYears();

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
          <Flex direction="column" gap="1.5rem">
            <Text>
              Answering 'Yes' or 'No' to the following questions will impact
              which measure results must be reported.
            </Text>
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
            <Dropdown
              name="year"
              id="year"
              label="Select the quality measure set reporting year"
              options={dropdownYears}
              onChange={handleYearChange}
              value={selectedYear}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                label:
                  "Does your state administer the HCBS CAHPS beneficiary survey?",
                value: [
                  {
                    label: "Yes",
                    value: "0",
                    checkedChildren: [],
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "1",
                    checkedChildren: [],
                    checked: false,
                  },
                ],
              }}
              formkey={"radioQuestion1"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                label:
                  "Does your state administer the HCI-IDD beneficiary survey?",
                value: [
                  {
                    label: "Yes",
                    value: "0",
                    checkedChildren: [],
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "1",
                    checkedChildren: [],
                    checked: false,
                  },
                ],
              }}
              formkey={"radioQuestion2"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                label:
                  "Does your state administer the NCI-AD beneficiary survey?",
                value: [
                  {
                    label: "Yes",
                    value: "0",
                    checkedChildren: [],
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "1",
                    checkedChildren: [],
                    checked: false,
                  },
                ],
              }}
              formkey={"radioQuestion2"}
            />
            <RadioField
              element={{
                type: ElementType.Radio,
                label: "Does your state administer the POM beneficiary survey?",
                value: [
                  {
                    label: "Yes",
                    value: "0",
                    checkedChildren: [],
                    checked: false,
                  },
                  {
                    label: "No",
                    value: "1",
                    checkedChildren: [],
                    checked: false,
                  },
                ],
              }}
              formkey={"radioQuestion2"}
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
