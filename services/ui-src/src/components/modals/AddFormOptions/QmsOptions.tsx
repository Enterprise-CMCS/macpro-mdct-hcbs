import { RadioField } from "components/fields/RadioField";
import { ElementType, Report } from "types";
import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "Quality Measure Set Report",
  yearSelect: "Select the quality measure set reporting year.",
  shortName: "QMS",
  sampleName: "HCBS QMS Report for 2026",
};

const parseReportOptions = (selectedReport: Report | undefined) => {
  return {
    cahps: selectedReport?.options.cahps,
    hciidd: selectedReport?.options.hciidd,
    nciad: selectedReport?.options.nciad,
    pom: selectedReport?.options.pom,
  };
};

const parseFormDataOptions = (formData: any) => {
  return {
    cahps: formData.cahps.answer == "true",
    hciidd: formData.hciidd.answer == "true",
    nciad: formData.nciad.answer == "true",
    pom: formData.pom.answer == "true",
  };
};

export const buildOptionElements = (selectedReport: Report | undefined) => {
  return (
    <>
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
          label: "Is your state reporting on the HCI-IDD beneficiary Survey?",
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
          label: "Is your state reporting on the NCI-AD beneficiary Survey?",
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
    </>
  );
};

export const QmsOptions = (
  selectedReport: Report | undefined
): AddEditReportModalOptions => ({
  verbiage: verbiage,
  reportOptions: parseReportOptions(selectedReport),
  optionsElements: buildOptionElements(selectedReport),
  parseFormDataOptions: parseFormDataOptions,
});
