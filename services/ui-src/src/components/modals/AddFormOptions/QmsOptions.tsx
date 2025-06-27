import { RadioField } from "components/fields/RadioField";
import { ElementType, Report } from "types";
import { AddEditReportModalOptions } from "../AddEditReportModal";

const verbiage = {
  reportName: "Quality Measure Set Report",
  yearSelect: "Select the quality measure set reporting year.",
  shortName: "QMS",
  sampleName: "HCBS QMS Report for 2026",
  topText:
    "Answering “Yes” or “No” to the following questions will impact which measure results must be reported.",
  yearHelperText:
    "This is the final year in a multi-year reporting period, used to indicate the endpoint of data collection.  For example, if a report covers the period of 2025 and 2026, the reporting year would be 2026.",
};

const parseReportOptions = (selectedReport: Report | undefined) => {
  return {
    cahps: selectedReport?.options.cahps,
    nciidd: selectedReport?.options.nciidd,
    nciad: selectedReport?.options.nciad,
    pom: selectedReport?.options.pom,
  };
};

const parseFormDataOptions = (formData: any) => {
  return {
    cahps: formData.cahps.answer == "true",
    nciidd: formData.nciidd.answer == "true",
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
          label: "Is your state reporting on the HCBS CAHPS Survey?",
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
          label: "Is your state reporting on the NCI-IDD Survey?",
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
          answer: selectedReport?.options.nciidd?.toString(),
        }}
        disabled={!!selectedReport}
        formkey={"nciidd"}
      />
      <RadioField
        element={{
          type: ElementType.Radio,
          id: "",
          label: "Is your state reporting on the NCI-AD Survey?",
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
          label: "Is your state reporting on the POM Survey?",
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
