import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { StateNames } from "../../../constants";
import { isReportType, isStateAbbr, Report, ReportType } from "types";
import {
  PageTemplate,
  DashboardTable,
  AddEditReportModal,
  AccordionItem,
  UnlockModal,
} from "components";
import {
  Box,
  Button,
  Image,
  Heading,
  Link,
  Text,
  Flex,
  useDisclosure,
  Accordion,
  Spinner,
} from "@chakra-ui/react";
import { useStore } from "utils";
import arrowLeftIcon from "assets/icons/arrows/icon_arrow_left_blue.png";
import { getReportsForState } from "utils/api/requestMethods/report";

export const DashboardPage = () => {
  const { userIsEndUser, userIsAdmin } = useStore().user ?? {};
  const { reportType, state } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>(
    undefined
  );
  const fullStateName = isStateAbbr(state) ? StateNames[state] : "";

  const getReportName = (type: string | undefined) => {
    switch (type) {
      case ReportType.QMS:
        return "Quality Measure Set Report";
      case ReportType.TA:
        return "Timely Access Report";
      case ReportType.CI:
        return "Critical Incident Report";
      default:
        return "";
    }
  };

  const reportName = getReportName(reportType);

  useEffect(() => {
    if (!isReportType(reportType) || !isStateAbbr(state)) {
      return;
    }

    reloadReports(reportType, state);
  }, [reportType, state]);

  const reloadReports = (reportType: string, state: string) => {
    (async () => {
      setIsLoading(true);
      let result = await getReportsForState(reportType, state);
      if (!userIsAdmin) {
        result = result.filter((report: Report) => !report.archived);
      }

      setReports(result);
      setIsLoading(false);
    })();
  };

  const openAddEditReportModal = (report?: Report) => {
    setSelectedReport(report);
    // use disclosure to open modal
    addEditReportModalOnOpenHandler();
  };

  // add/edit program modal disclosure
  const {
    isOpen: addEditReportModalIsOpen,
    onOpen: addEditReportModalOnOpenHandler,
    onClose: addEditReportModalOnCloseHandler,
  } = useDisclosure();

  const {
    isOpen: unlockModalIsOpen,
    onOpen: unlockModalOnOpenHandler,
    onClose: unlockModalOnCloseHandler,
  } = useDisclosure();

  return (
    <PageTemplate type="report" sxOverride={sx.layout}>
      <Link as={RouterLink} to="/" variant="return">
        <Image src={arrowLeftIcon} alt="Arrow left" className="icon" />
        Return home
      </Link>

      <Box sx={sx.leadTextBox}>
        <Heading as="h1" variant="h1">
          {fullStateName} {reportName}
        </Heading>
        <Accordion
          allowToggle={true}
          sx={sx.accordion}
          defaultIndex={[0]} // sets the accordion to open by default
        >
          <AccordionItem label="Instructions" sx={sx.accordionItem}>
            {userIsAdmin ? (
              <Box sx={sx.accordionPanel}>
                <Heading size="sm" fontWeight="bold">
                  Admin Instructions
                </Heading>
                <ul>
                  <li>
                    To view a state or territory’s submission, use “View”.
                  </li>
                  <li>
                    To allow a state or territory to make corrections or edits
                    to a submission use “Unlock” to release the submission. The
                    status will change to “In revision”.
                  </li>
                  <li>
                    Submission count is shown in the # column. Submissions
                    started and submitted once have a count of 1. When a state
                    or territory resubmits a previous submission, the count
                    increases by 1.
                  </li>
                  <li>
                    To archive a submission and hide it from a state or
                    territory’s dashboard, use “Archive”.
                  </li>
                </ul>
              </Box>
            ) : (
              <Box sx={sx.accordionPanel}>
                <p>
                  <strong>Creating a New Report</strong>
                </p>
                <p>
                  Click the <b>“Start {reportName}”</b> button to begin creating
                  your report. A series of questions will appear to gather the
                  necessary information for your report. Fill out each field
                  accurately to ensure your report is complete. Before
                  submitting, review the information you’ve provided. If
                  everything looks good, confirm your entries and proceed.
                </p>
                <p>
                  Once the report is generated, you can edit the name of the
                  report and monitor its status in the dashboard below.
                </p>
                <p>
                  Please note, while you can generate multiple reports for the
                  same reporting period, you should only submit a single report
                  for the state.
                </p>
                <p>
                  <strong>Understanding Report Statuses</strong>
                </p>
                <p>
                  <ul>
                    <li>
                      <strong>Not Started:</strong> The report has been created
                      but no data has been entered or actions taken.
                    </li>
                    <li>
                      <strong>In Progress:</strong> The report is actively being
                      worked on, with some or all data entered.
                    </li>
                    <li>
                      <strong>Submitted:</strong> The report has been completed
                      and submitted to CMS for review.
                    </li>
                    <li>
                      <strong>In-Revision:</strong> The report has been sent
                      back to the state for revisions or additional information
                      after submission.
                    </li>
                  </ul>
                </p>
                <p>
                  Use the dashboard below to check your report’s status and take
                  any necessary follow-up actions.
                </p>
              </Box>
            )}
          </AccordionItem>
        </Accordion>
      </Box>
      <Flex sx={sx.bodyBox} gap="2rem" flexDirection="column">
        {!isLoading && (
          <DashboardTable
            reports={reports}
            openAddEditReportModal={openAddEditReportModal}
            unlockModalOnOpenHandler={unlockModalOnOpenHandler}
          />
        )}
        {isLoading && (
          <Flex justify="center">
            <Spinner size="md" />
          </Flex>
        )}
        {!reports?.length &&
          (userIsAdmin ? (
            <Text variant="tableEmpty">
              Once a state or territory begins a QMS Report, you will be able to
              view it here.
            </Text>
          ) : (
            <Text variant="tableEmpty">
              Keep track of your {reportName}s, once you start a report you can
              access it here.
            </Text>
          ))}
        {userIsEndUser && (
          <Flex justifyContent="center">
            <Button onClick={() => openAddEditReportModal()} type="submit">
              Start {reportName}
            </Button>
          </Flex>
        )}
      </Flex>
      <AddEditReportModal
        activeState={state!}
        reportType={reportType!}
        modalDisclosure={{
          isOpen: addEditReportModalIsOpen,
          onClose: addEditReportModalOnCloseHandler,
        }}
        reportHandler={reloadReports}
        selectedReport={selectedReport}
      />
      <UnlockModal
        modalDisclosure={{
          isOpen: unlockModalIsOpen,
          onClose: unlockModalOnCloseHandler,
        }}
      ></UnlockModal>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      maxWidth: "appMax",
      marginTop: "2rem",
      marginBottom: "3.5rem",
    },
  },
  leadTextBox: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "2.5rem auto 0rem",
    ".tablet &, .mobile &": {
      margin: "2.5rem 0 1rem",
    },
  },
  bodyBox: {
    maxWidth: "55.25rem",
    margin: "0 auto",
    ".desktop &": {
      width: "100%",
    },
    ".tablet &, .mobile &": {
      margin: "0",
    },
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
  accordion: {
    marginTop: "2rem",
    color: "palette.base",
  },
  accordionItem: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  accordionPanel: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
    header: {
      marginBottom: "1.5rem",
    },
    p: {
      marginBottom: "1.5rem",
    },
  },
};
