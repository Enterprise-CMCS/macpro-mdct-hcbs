import {
  ChoiceList as CmsdsChoiceList,
  Dropdown as CmsdsDropdown,
} from "@cmsgov/design-system";
import { LiteReport } from "types";
import { AddEditReportModalOptions } from "../AddEditReportModal";
import { useEffect, useState } from "react";
import { ErrorMessages } from "../../../constants";

export const verbiage = {
  reportName: "Quality Measure Set Report",
  yearSelect: "Select the quality measure set reporting year.",
  sampleName: "HCBS QMS Report for 2026",
  topText:
    "Answering “Yes” or “No” to the following questions will impact which measure results must be reported.",
  yearHelperText:
    "This is the final year in a multi-year reporting period, used to indicate the endpoint of data collection.  For example, if a report covers the period of 2025 and 2026, the reporting year would be 2026.",
  nameLabel: "Quality Measure Set Report Name",
  nameHelperText: (state?: string) =>
    `Name this QMS report so you can easily refer to it. Consider using timeframe(s). Sample Report Name: "${state} HCBS QMS Report for 2026"`,
};

export const QmsOptionsComponent: AddEditReportModalOptions["OptionsComponent"] =
  ({
    selectedReport,
    year,
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
    function assertIsKey(
      key: string
    ): asserts key is keyof typeof optionLabels {
      if (!(key in optionLabels)) throw new Error(`Expected key, got '${key}'`);
    }

    const formDataForReport = (report: LiteReport | undefined) => ({
      cahps: report?.options.cahps?.toString(),
      "cahps-period": report?.options["cahps-period"],
      nciidd: report?.options.nciidd?.toString(),
      "nciidd-period": report?.options["nciidd-period"],
      nciad: report?.options.nciad?.toString(),
      "nciad-period": report?.options["nciad-period"],
      pom: report?.options.pom?.toString(),
      "pom-period": report?.options["pom-period"],
    });
    const initialFormData = formDataForReport(selectedReport);
    const [formData, setFormData] = useState(initialFormData);
    const [errorData, setErrorData] = useState({
      cahps: "",
      "cahps-period": "",
      nciidd: "",
      "nciidd-period": "",
      nciad: "",
      "nciad-period": "",
      pom: "",
      "pom-period": "",
    });

    useEffect(() => {
      setFormData(formDataForReport(selectedReport));
    }, [selectedReport]);

    const computeErrors = (form: typeof formData) => {
      const errorFlags = {
        cahps: !form.cahps,
        "cahps-period": form.cahps === "true" && !form["cahps-period"],
        nciidd: !form.nciidd,
        "nciidd-period": form.nciidd === "true" && !form["nciidd-period"],
        nciad: !form.nciad,
        "nciad-period": form.nciad === "true" && !form["nciad-period"],
        pom: !form.pom,
        "pom-period": form.pom === "true" && !form["pom-period"],
      };

      return Object.fromEntries(
        Object.entries(errorFlags).map(([fieldName, isInError]) => [
          fieldName,
          isInError ? ErrorMessages.requiredResponse : "",
        ])
      ) as Record<keyof typeof errorFlags, string>;
    };

    useEffect(() => {
      if (submissionAttempted) {
        const newErrorData = computeErrors(formData);
        setErrorData(newErrorData);
        setOptionsComplete(Object.values(newErrorData).every((val) => !val));
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
        "cahps-period": updatedFormData["cahps-period"],
        nciidd: updatedFormData.nciidd == "true",
        "nciidd-period": updatedFormData["nciidd-period"],
        nciad: updatedFormData.nciad == "true",
        "nciad-period": updatedFormData["nciad-period"],
        pom: updatedFormData.pom == "true",
        "pom-period": updatedFormData["pom-period"],
      };
      onOptionsChange(updatedOptions);

      const updatedErrors = computeErrors(updatedFormData);
      if (submissionAttempted) {
        setErrorData(updatedErrors);
      }
      setOptionsComplete(Object.values(updatedErrors).every((val) => !val));
    };

    const parsedYear = Number(year);
    const buildPeriodOptions = (
      startMonth: string,
      endMonth: string,
      endYearOffset: number
    ) => [
      {
        label: "Select a survey year",
        value: "",
      },
      {
        label: `${startMonth} ${parsedYear - 2} - ${endMonth} ${
          parsedYear - 2 + endYearOffset
        }`,
        value: `${parsedYear - 2}`,
      },
      {
        label: `${startMonth} ${parsedYear - 1} - ${endMonth} ${
          parsedYear - 1 + endYearOffset
        }`,
        value: `${parsedYear - 1}`,
      },
    ];
    const julyToJunePeriodOptions = buildPeriodOptions("July", "June", 1);
    const calendarYearPeriodOptions = buildPeriodOptions("Jan", "Dec", 0);
    const periodOptionsBySurvey = {
      nciidd: julyToJunePeriodOptions,
      nciad: julyToJunePeriodOptions,
      cahps: calendarYearPeriodOptions,
      pom: calendarYearPeriodOptions,
    };

    return (
      <>
        {Object.entries(optionLabels).map(([key, label]) => {
          assertIsKey(key);
          return (
            <CmsdsChoiceList
              key={key}
              name={key}
              type="radio"
              label={label}
              choices={[
                {
                  label: "No",
                  value: "false",
                  checked: formData[key] === "false",
                },
                {
                  label: "Yes",
                  value: "true",
                  checked: formData[key] === "true",
                  checkedChildren: (
                    <CmsdsDropdown
                      name={`${key}-period`}
                      label="Survey start and end date"
                      hint="Choose a survey year from the two years prior to the reporting year."
                      value={formData[`${key}-period`]}
                      options={periodOptionsBySurvey[key]}
                      errorMessage={errorData[`${key}-period`]}
                      onChange={onChange}
                      disabled={Number.isNaN(parsedYear)}
                    />
                  ),
                },
              ]}
              errorMessage={errorData[key]}
              onChange={onChange}
              disabled={!!selectedReport}
            />
          );
        })}
      </>
    );
  };

export default {
  verbiage,
  OptionsComponent: QmsOptionsComponent,
};
