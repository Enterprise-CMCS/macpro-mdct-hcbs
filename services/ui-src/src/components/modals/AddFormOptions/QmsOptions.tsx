import { ChoiceList as CmsdsChoiceList } from "@cmsgov/design-system";
import { Report } from "types";
import { AddEditReportModalOptions } from "../AddEditReportModal";
import { useEffect, useState } from "react";
import { requiredResponse } from "../../../constants";

export const verbiage = {
  reportName: "Quality Measure Set Report",
  yearSelect: "Select the quality measure set reporting year.",
  shortName: "QMS",
  sampleName: "HCBS QMS Report for 2026",
  topText:
    "Answering “Yes” or “No” to the following questions will impact which measure results must be reported.",
  yearHelperText:
    "This is the final year in a multi-year reporting period, used to indicate the endpoint of data collection.  For example, if a report covers the period of 2025 and 2026, the reporting year would be 2026.",
};

export const QmsOptionsComponent: AddEditReportModalOptions["OptionsComponent"] =
  ({
    selectedReport,
    onOptionsChange,
    submissionAttempted,
    setOptionsComplete,
  }) => {
    const optionLabels = {
      cahps: "Is your state reporting on the HCBS CAHPS Survey?",
      nciidd: "Is your state reporting on the NCI-IDD Survey?",
      nciad: "Is your state reporting on the NCI-AD Survey?",
      pom: "Is your state reporting on the POM Survey?",
    };

    const formDataForReport = (report: Report | undefined) => ({
      cahps: report?.options.cahps?.toString(),
      nciidd: report?.options.nciidd?.toString(),
      nciad: report?.options.nciad?.toString(),
      pom: report?.options.pom?.toString(),
    });
    const initialFormData = formDataForReport(selectedReport);
    const [formData, setFormData] = useState(initialFormData);
    const [errorData, setErrorData] = useState({
      cahps: "",
      nciidd: "",
      nciad: "",
      pom: "",
    });

    useEffect(() => {
      setFormData(formDataForReport(selectedReport));
    }, [selectedReport]);

    useEffect(() => {
      if (submissionAttempted) {
        const newErrorData = {
          cahps: formData.cahps ? "" : requiredResponse,
          nciidd: formData.nciidd ? "" : requiredResponse,
          nciad: formData.nciad ? "" : requiredResponse,
          pom: formData.pom ? "" : requiredResponse,
        };
        setErrorData(newErrorData);
        setOptionsComplete(Object.values(formData).every((val) => !!val));
      }
    }, [submissionAttempted]);

    const onChange = async (evt: {
      target: { name: string; value: string };
    }) => {
      const { name, value } = evt.target;
      const updatedFormData = {
        ...formData,
        [name]: value,
      };
      setFormData(updatedFormData);

      const updatedOptions = {
        cahps: updatedFormData.cahps == "true",
        nciidd: updatedFormData.nciidd == "true",
        nciad: updatedFormData.nciad == "true",
        pom: updatedFormData.pom == "true",
      };
      onOptionsChange(updatedOptions);

      setErrorData({
        ...errorData,
        [name]: value ? "" : requiredResponse,
      });
      setOptionsComplete(Object.values(updatedFormData).every((val) => !!val));
    };

    return (
      <>
        {Object.entries(optionLabels).map(([key, label]) => (
          <CmsdsChoiceList
            key={key}
            name={key}
            type="radio"
            label={label}
            choices={[
              {
                label: "Yes",
                value: "true",
                checked: formData[key as keyof typeof optionLabels] === "true",
              },
              {
                label: "No",
                value: "false",
                checked: formData[key as keyof typeof optionLabels] === "false",
              },
            ]}
            errorMessage={errorData[key as keyof typeof optionLabels]}
            onChange={onChange}
            disabled={!!selectedReport}
          />
        ))}
      </>
    );
  };

export default {
  verbiage,
  OptionsComponent: QmsOptionsComponent,
};
