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
  PageType,
  ParentPageTemplate,
  Report,
  ReportType,
  ReviewSubmitTemplate,
  PageStatus,
} from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";
import { StateNames } from "../../../constants";
import { ExportedReportTable } from "components/export/ExportedReportTable";

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
      <ExportedReportBanner />
      <Box sx={sx.container}>
        {(report && reportPages.length > 0 && (
          <Flex sx={sx.innerContainer} gap="2rem">
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
  const shouldRender = (section: typeof reportPages[number]) => {
    if (section.id === "review-submit" || section.id === "root") {
      return false;
    }

    if (
      section.type === PageType.Measure &&
      (section as MeasurePageTemplate).required === false &&
      (section as MeasurePageTemplate).status === PageStatus.NOT_STARTED
    ) {
      return false;
    }

    if (
      section.type === PageType.MeasureResults &&
      (section as FormPageTemplate).status === PageStatus.NOT_STARTED
    ) {
      return false;
    }

    return true;
  };

  reportPages = reportPages.filter(shouldRender);

  // REQUIRED MEASURES - START

  let filteredRequiredMeasures = reportPages.filter(
    (section) =>
      section.type === "measure" &&
      (section as MeasurePageTemplate).required === true
  ) as MeasurePageTemplate[];

  const tempRequiredMeasuresSection: typeof reportPages[number][] = [];
  if (filteredRequiredMeasures.length > 0) {
    // Add heading to beginning of section
    tempRequiredMeasuresSection.push({
      title: "Required Measures",
      id: "required-measures-heading",
      type: PageType.Standard,
      elements: [],
    });

    // For every measure, add to section + add its dependent pages
    filteredRequiredMeasures.forEach((section) => {
      tempRequiredMeasuresSection.push(section);
      const measureIdx = reportPages.findIndex(
        (measure) => measure.id === section.id
      );
      reportPages.splice(Number(measureIdx), 1);

      const depPages = section.dependentPages;
      depPages?.forEach((page) => {
        const measureResultIdx = reportPages.findIndex(
          (section) => section.id === page.template
        );
        if (measureResultIdx != -1) {
          tempRequiredMeasuresSection.push(reportPages[measureResultIdx]);
          reportPages.splice(measureResultIdx, 1);
        }
      });
    });
  }

  const indexToInsertReqMeasures = reportPages.findIndex(
    (section) => section.id === "req-measure-result"
  );
  reportPages.splice(
    indexToInsertReqMeasures,
    1,
    ...tempRequiredMeasuresSection
  );

  // OPTIONAL MEASURES - START

  let filteredOptionalMeasures = reportPages.filter(
    (section) =>
      section.type === "measure" &&
      (section as MeasurePageTemplate).required === false
  ) as MeasurePageTemplate[];

  const tempOptionalMeasuresSection: typeof reportPages[number][] = [];
  if (filteredOptionalMeasures.length > 0) {
    // Add heading to beginning of section
    tempOptionalMeasuresSection.push({
      title: "Optional Measures",
      id: "optional-measures-heading",
      type: PageType.Standard,
      elements: [],
    });

    // For every measure, add to section + add its dependent pages
    filteredOptionalMeasures.forEach((section) => {
      tempOptionalMeasuresSection.push(section);
      const measureIdx = reportPages.findIndex(
        (measure) => measure.id === section.id
      );
      reportPages.splice(Number(measureIdx), 1);

      const depPages = section.dependentPages;
      depPages?.forEach((page) => {
        const measureResultIdx = reportPages.findIndex(
          (section) => section.id === page.template
        );
        if (measureResultIdx != -1) {
          tempOptionalMeasuresSection.push(reportPages[measureResultIdx]);
          reportPages.splice(measureResultIdx, 1);
        }
      });
    });
  }

  const indexToInsertOptionalMeasures = reportPages.findIndex(
    (section) => section.id === "optional-measure-result"
  );
  reportPages.splice(
    indexToInsertOptionalMeasures,
    1,
    ...tempOptionalMeasuresSection
  );

  return reportPages.map((section, idx) => {
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
    },
    h4: {
      marginBottom: "-0.5rem",
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
