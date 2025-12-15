import { FormEvent, useEffect, useState, ReactElement } from "react";
import { Modal } from "components";
import {
  TextField as CmsdsTextField,
  Dropdown as CmsdsDropdownField,
} from "@cmsgov/design-system";
import { Spinner, Flex, Text } from "@chakra-ui/react";
import {
  createReport,
  updateReport,
  getReportsForState,
} from "utils/api/requestMethods/report";
import {
  isReportType,
  LiteReport,
  ReportOptions,
  ReportStatus,
  ReportType,
} from "types/report";
import QmsOptions from "./AddFormOptions/QmsOptions";
import TacmOptions from "./AddFormOptions/TacmOptions";
import CiOptions from "./AddFormOptions/CiOptions";
import PcpOptions from "./AddFormOptions/PcpOptions";
import WwlOptions from "./AddFormOptions/WwlOptions";
import { ErrorMessages } from "../../constants";

export type AddEditReportModalOptions = {
  verbiage: {
    reportName: string;
    yearSelect: string;
    nameHelperText: (state: string) => string;
    nameLabel: string;
    topText?: string;
    yearHelperText?: string;
  };
  /**
   * If a report type has inputs to specify its creation options,
   * those inputs will be included in this component.
   * If not (as for TACM and CI), this will be undefined.
   */
  OptionsComponent?: (props: {
    selectedReport: LiteReport | undefined;
    onOptionsChange: (options: Record<string, any>) => void;
    submissionAttempted: boolean;
    setOptionsComplete: (isComplete: boolean) => void;
  }) => ReactElement;
};

const buildModalOptions = (
  reportType: ReportType
): AddEditReportModalOptions => {
  const optionsByReportType: Record<ReportType, AddEditReportModalOptions> = {
    [ReportType.QMS]: QmsOptions,
    [ReportType.TACM]: TacmOptions,
    [ReportType.CI]: CiOptions,
    [ReportType.PCP]: PcpOptions,
    [ReportType.WWL]: WwlOptions,
  };
  return optionsByReportType[reportType];
};

export const AddEditReportModal = ({
  activeState,
  reportType,
  modalDisclosure,
  selectedReport,
  reportHandler,
}: Props) => {
  if (!isReportType(reportType)) return null;

  const dropdownYears = [{ label: "2026", value: "2026" }];
  const { verbiage, OptionsComponent } = buildModalOptions(reportType);

  const formDataForReport = (report: LiteReport | undefined) => ({
    reportTitle: report?.name ?? "",
    year: report?.year?.toString() ?? dropdownYears[0].value,
    options: selectedReport?.options ?? {},
  });
  const initialFormData = formDataForReport(selectedReport);
  const [formData, setFormData] = useState(initialFormData);
  const [errorData, setErrorData] = useState({ reportTitle: "", year: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [optionsComplete, setOptionsComplete] = useState(!OptionsComponent);
  const readOnly = selectedReport?.status === ReportStatus.SUBMITTED;

  useEffect(() => {
    setFormData(formDataForReport(selectedReport));
  }, [selectedReport, modalDisclosure.isOpen]);

  useEffect(() => {
    setErrorMessage(formData.reportTitle).then((errorMessage) => {
      setErrorData((prevErrorData) => ({
        ...prevErrorData,
        reportTitle: errorMessage,
      }));
    });
  }, [formData.reportTitle]);

  const doesReportNameExist = async (value: string) => {
    let existingReports = await getReportsForState(reportType, activeState);
    const doesReportNameAlreadyExist = existingReports.filter(
      (report) =>
        report.name === value &&
        report.year === Number(formData.year) &&
        report.id !== selectedReport?.id
    );

    return doesReportNameAlreadyExist.length > 0;
  };

  const setErrorMessage = async (value: string): Promise<string> => {
    if (!value) {
      return ErrorMessages.requiredResponse;
    }
    const duplicateReportName = await doesReportNameExist(value);
    if (duplicateReportName) {
      return ErrorMessages.mustBeUniqueReportName;
    }
    return "";
  };

  const onChange = (evt: { target: { name: string; value: string } }) => {
    const { name, value } = evt.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
  };

  const onOptionsChange = (optionsData: Record<string, any>) => {
    setFormData({
      ...formData,
      options: optionsData,
    });
  };
  const onSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    setSubmissionAttempted(true);
    const reportTitleError = await setErrorMessage(formData.reportTitle);
    const newErrorData = {
      reportTitle: reportTitleError,
      year: formData.year ? "" : ErrorMessages.requiredResponse,
    };
    setErrorData(newErrorData);
    const canSubmit =
      optionsComplete &&
      !newErrorData.reportTitle &&
      !!formData.reportTitle &&
      !!formData.year;
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);

    const userEnteredReportName = formData.reportTitle!;
    if (selectedReport) {
      if (userEnteredReportName) {
        selectedReport.name = userEnteredReportName;
      }
      await updateReport(selectedReport);
    } else {
      const reportOptions: ReportOptions = {
        name: userEnteredReportName,
        year: Number(formData.year),
        options: formData.options,
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
      <form id="addEditReportModal" onSubmit={onSubmit}>
        <Flex direction="column" gap="2rem">
          {verbiage.topText && <Text>{verbiage.topText}</Text>}
          <CmsdsTextField
            name="reportTitle"
            label={verbiage.nameLabel}
            hint={verbiage.nameHelperText(activeState)}
            onChange={onChange}
            onBlur={() =>
              setErrorData({
                ...errorData,
                reportTitle: formData.reportTitle
                  ? ""
                  : ErrorMessages.requiredResponse,
              })
            }
            value={formData.reportTitle}
            errorMessage={errorData.reportTitle}
            disabled={readOnly}
          />
          <CmsdsDropdownField
            name="year"
            label={verbiage.yearSelect}
            hint={verbiage.yearHelperText ?? ""}
            onChange={onChange}
            value={formData.year}
            errorMessage={errorData.year}
            options={dropdownYears}
            disabled={!!selectedReport}
          />
          {OptionsComponent ? (
            <OptionsComponent
              selectedReport={selectedReport}
              onOptionsChange={onOptionsChange}
              submissionAttempted={submissionAttempted}
              setOptionsComplete={setOptionsComplete}
            />
          ) : null}
        </Flex>
      </form>
    </Modal>
  );
};

interface Props {
  activeState: string;
  reportType: string;
  selectedReport?: LiteReport;
  modalDisclosure: {
    isOpen: boolean;
    onClose: () => void;
  };
  reportHandler: (reportType: string, activeState: string) => void;
}
