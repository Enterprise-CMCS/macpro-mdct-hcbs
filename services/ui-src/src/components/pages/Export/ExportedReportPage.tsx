import { ComponentClass } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
import {
  Box,
  Center,
  Heading,
  Spinner,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { formatMonthDayYear, useStore } from "utils";
import {
  FormPageTemplate,
  getReportName,
  MeasurePageTemplate,
  ParentPageTemplate,
  Report,
  ReviewSubmitTemplate,
} from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";
import { StateNames } from "../../../constants";
import { ExportedReportTable } from "components/export/ExportedReportTable";

export const ExportedReportPage = () => {
  const { report } = useStore();
  const reportPages = report?.pages;
  if (!reportPages) return null;

  /*
   * This rename & cast is due to a package import issue.
   * It can be removed once we get to react >= 18.3.0 and @types/react >= 18.3.0
   */
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  return (
    <Box>
      <ExportedReportBanner />
      <Box sx={sx.container}>
        {(report && reportPages.length > 0 && (
          <Box sx={sx.innerContainer}>
            {/* pdf metadata */}
            <Helmet>
              <title>{reportTitle(report)}</title>
              <meta name="author" content="CMS" />
              <meta name="subject" content="Quality Measure Set" />
              <meta name="language" content="English" />
            </Helmet>
            {/* report heading */}
            <Heading as="h1" variant="h1">
              {reportTitle(report)}
            </Heading>
            {/* report details */}
            {reportDetails(report)}
            {/* report submission set up */}
            {reportSubmissionSetUp(report)}
            {/* report sections */}
            {renderReportSections(reportPages)}
          </Box>
        )) || (
          <Center>
            <Spinner size="lg" />
          </Center>
        )}
      </Box>
    </Box>
  );
};

export const reportTitle = (report: Report) => {
  return `${StateNames[report.state]} ${getReportName(report.type)} for: ${
    report.name
  }`;
};

export const reportDetails = (report: Report) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Reporting year</Th>
          <Th>Last edited</Th>
          <Th>Edited by</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>{report.year}</Td>
          <Td>{formatMonthDayYear(report.lastEdited!)}</Td>
          <Td>{report.lastEditedBy}</Td>
          <Td>{report.status}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export const reportSubmissionSetUp = (report: Report) => {
  const rows = [
    {
      indicator:
        "Does your state administer the HCBS CAHPS beneficiary survey?",
      response: report.options.cahps ? "Yes" : "No",
    },
    {
      indicator: "Does your state administer the NCI-IDD beneficiary survey?",
      response: report.options.nciidd ? "Yes" : "No",
    },
    {
      indicator: "Does your state administer the NCI-AD beneficiary survey?",
      response: report.options.nciad ? "Yes" : "No",
    },
    {
      indicator: "Does your state administer the POM beneficiary survey?",
      response: report.options.pom ? "Yes" : "No",
    },
  ];

  return (
    <Box>
      <Heading as="h4" fontWeight="bold">
        Submission Set Up
      </Heading>
      <ExportedReportTable rows={rows}></ExportedReportTable>
    </Box>
  );
};

export const renderReportSections = (
  reportPages: (
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate
  )[]
) => {
  // recursively render sections
  const renderSection = (
    section:
      | ParentPageTemplate
      | FormPageTemplate
      | MeasurePageTemplate
      | ReviewSubmitTemplate
  ) => {
    return (
      <Box key={section.id}>
        {/* if section does not have children and has content to render, render it */}
        <Flex gap="2rem" flexDirection="column">
          <Heading variant="subHeader">{section.title}</Heading>
          <ExportedReportWrapper section={section} />
        </Flex>
      </Box>
    );
  };

  return reportPages
    .filter(
      (section) => section.id !== "review-submit" && section.id !== "root"
    )
    .map(
      (
        section:
          | ParentPageTemplate
          | FormPageTemplate
          | MeasurePageTemplate
          | ReviewSubmitTemplate,
        idx
      ) => (
        <Box key={`${section.id}.${idx}`} mt="3.5rem">
          {renderSection(section)}
        </Box>
      )
    );
};

export const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
    paddingBottom: "4rem",
  },
  innerContainer: {
    width: "100%",
    maxWidth: "40rem",
    margin: "auto",
    "@media print": {
      margin: "5rem 0",
    },
  },
};
