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
  TableCaption,
  VisuallyHidden,
} from "@chakra-ui/react";
import { formatMonthDayYear, useStore } from "utils";
import { getReportName, PageTemplate, Report, ReportType } from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";
import { StateNames } from "../../../constants";
import { ExportedReportTable } from "components/export/ExportedReportTable";
import { iterateExportPages } from "./ExportedReportPageHelpers";

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
      <TableCaption>
        <VisuallyHidden>{reportTitle(report)}</VisuallyHidden>
      </TableCaption>
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

  const rows: { indicator: string; response: string }[] = [];
  const surveys = [
    { id: "cahps", name: "HCBS CAHPS" },
    { id: "nciidd", name: "NCI-IDD" },
    { id: "nciad", name: "NCI-AD" },
    { id: "pom", name: "POM" },
  ] as const;

  for (let { id, name } of surveys) {
    rows.push({
      indicator: `Is your state reporting on the ${name} Survey?`,
      response: report.options[id] ? "Yes" : "No",
    });
    if (report.options[id]) {
      const year = Number(report.options[`${id}-period`]);
      rows.push({
        indicator: "Reporting start and end date",
        response: `July ${year - 1}—June ${year}`,
      });
    }
  }

  return (
    <Box>
      <Heading as="h2" variant="h2">
        Submission Set Up
      </Heading>
      <ExportedReportTable
        rows={rows}
        caption="Submission Set Up"
      ></ExportedReportTable>
    </Box>
  );
};

export const renderReportSections = (reportPages: PageTemplate[]) => {
  reportPages = [...iterateExportPages(reportPages)];

  return reportPages.map((section, idx) => {
    const isHeaderOnlySection = section.id === "injected-heading";

    /*
     * There are some sections that were manually added into the PDF
     * and only contain a header. These sections don't contain a page's
     * information, rather title a section. They don't need an additional
     * section margin (standard of 2rem, hence the -2rem value)
     */
    if (isHeaderOnlySection) {
      return (
        <Box key={`${section.id}.${idx}`} marginBottom="-spacer4">
          <Heading as="h2" variant="h2">
            {section.navTitle}
          </Heading>
        </Box>
      );
    }

    const showHeader =
      section.type != "measure" && section.type != "measureResults";
    return (
      <Box key={`${section.id}.${idx}`}>
        <Flex flexDirection="column">
          {showHeader && (
            <Heading as="h2" variant="h2">
              {section.navTitle}
            </Heading>
          )}
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
    paddingY: "spacer6",
    paddingX: "spacer2",
    "h1, h2, h3": {
      marginBottom: "spacer3",
      color: "black",
    },
    h4: {
      marginBottom: "-spacer1",
      color: "black",
    },
    ".performance-rate-header": {
      marginBottom: "spacer2",
      color: "palette.black",
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
