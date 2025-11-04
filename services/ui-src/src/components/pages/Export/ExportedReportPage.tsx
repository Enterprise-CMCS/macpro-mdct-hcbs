import React, { ComponentClass, useEffect, useState } from "react";
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
  ReportType,
  ReviewSubmitTemplate,
} from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";
import { StateNames } from "../../../constants";
import { ExportedReportTable } from "components/export/ExportedReportTable";
import {
  shouldRender,
  createMeasuresSection,
} from "./ExportedReportPageHelpers";

export const ExportedReportPage = () => {
  const { report } = useStore();
  const [renderedReport, setRenderedReport] = useState<React.JSX.Element[]>([]);
  const reportPages = structuredClone(report?.pages);

  useEffect(() => {
    if (!reportPages) return;
    setRenderedReport(renderReportSections(reportPages));
  }, [report]);

  if (!reportPages) return null;

  /*
   * This rename & cast is due to a package import issue.
   * It can be removed once we get to react >= 18.3.0 and @types/react >= 18.3.0
   */
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  return (
    <Box>
      <ExportedReportBanner reportName={getReportName(report?.type)} />
      <Box sx={sx.container}>
        {(report && reportPages.length > 0 && (
          <Flex sx={sx.innerContainer} gap="spacer4">
            {/* pdf metadata */}
            <Helmet>
              <title>{reportTitle(report)}</title>
              <meta name="author" content="CMS" />
              <meta name="subject" content="Quality Measure Set" />
              <meta name="language" content="English" />
            </Helmet>
            <Box>
              {/* report heading */}
              <Heading as="h1" variant="h1">
                {reportTitle(report)}
              </Heading>
              {/* report details */}
              {reportDetails(report)}
            </Box>
            {/* report submission set up */}
            {reportSubmissionSetUp(report)}
            {/* report sections */}
            {renderedReport}
          </Flex>
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
    <Table variant={"reportDetails"}>
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
  if (report.type !== ReportType.QMS) return;
  const rows = [
    {
      indicator: "Is your state reporting on the HCBS CAHPS Survey?",
      response: report.options.cahps ? "Yes" : "No",
    },
    {
      indicator: "Is your state reporting on the NCI-IDD Survey?",
      response: report.options.nciidd ? "Yes" : "No",
    },
    {
      indicator: "Is your state reporting on the NCI-AD Survey?",
      response: report.options.nciad ? "Yes" : "No",
    },
    {
      indicator: "Is your state reporting on the POM Survey?",
      response: report.options.pom ? "Yes" : "No",
    },
  ];

  return (
    <Box>
      <Heading as="h2" fontWeight="bold">
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
  reportPages = reportPages.filter(shouldRender);

  // REQUIRED MEASURES
  const requiredMeasuresStartIdx = reportPages.findIndex(
    (section) => section.id === "req-measure-result"
  );
  requiredMeasuresStartIdx >= 0 &&
    reportPages.splice(
      requiredMeasuresStartIdx,
      1,
      ...createMeasuresSection(true, reportPages)
    );

  // OPTIONAL MEASURES
  const optionalMeasuresStartIdx = reportPages.findIndex(
    (section) => section.id === "optional-measure-result"
  );
  optionalMeasuresStartIdx >= 0 &&
    reportPages.splice(
      optionalMeasuresStartIdx,
      1,
      ...createMeasuresSection(false, reportPages)
    );

  return reportPages.map((section, idx) => {
    const isHeaderOnlySection =
      section.id === "required-measures-heading" ||
      section.id === "optional-measures-heading";

    /*
     * There are some sections that were manually added into the PDF
     * and only contain a header. These sections don't contain a page's
     * information, rather title a section. They don't need an additional
     * section margin (standard of 2rem, hence the -2rem value)
     */
    if (isHeaderOnlySection) {
      return (
        <Box key={`${section.id}.${idx}`} marginBottom="-2rem">
          <Heading variant="subHeader">{section.title}</Heading>
        </Box>
      );
    }

    const showHeader =
      section.type != "measure" && section.type != "measureResults";
    return (
      <Box key={`${section.id}.${idx}`}>
        <Flex flexDirection="column">
          {showHeader && <Heading variant="subHeader">{section.title}</Heading>}
          <ExportedReportWrapper section={section} />
        </Flex>
      </Box>
    );
  });
};

export const sx = {
  container: {
    width: "100%",
    maxWidth: "55.25rem",
    margin: "0 auto",
    paddingBottom: "4rem",
    "h1, h2, h3": {
      marginBottom: "1.5rem",
      color: "black",
    },
    h4: {
      marginBottom: "-0.5rem",
      color: "black",
    },
    ".performance-rate-header": {
      marginBottom: "1rem",
    },
  },
  innerContainer: {
    width: "100%",
    maxWidth: "40rem",
    margin: "auto",
    "@media print": {
      margin: "5rem 0",
    },
    flexDir: "column",
  },
};
