import { Helmet } from "react-helmet";
import { Box, Center, Heading, Spinner, Flex } from "@chakra-ui/react";
import { useStore } from "utils";
import qmVerbiage from "verbiage/export/qms-export";
import {
  FormPageTemplate,
  MeasurePageTemplate,
  PageType,
  ParentPageTemplate,
  Report,
} from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";

export const ExportedReportPage = () => {
  const { report } = useStore();
  const { metadata } = qmVerbiage;
  const reportPages =
    report?.pages.filter(
      (page) => page.type !== PageType.Modal && page.type !== PageType.Measure
    ) || [];

  return (
    <Box>
      <ExportedReportBanner />
      <Box sx={sx.container}>
        {(report && reportPages.length > 0 && (
          <Box sx={sx.innerContainer}>
            {/* pdf metadata */}
            <Helmet>
              <title>{reportTitle(report)}</title>
              <meta name="author" content={metadata.author} />
              <meta name="subject" content={metadata.subject} />
              <meta name="language" content={metadata.language} />
            </Helmet>
            {/* report heading */}
            <Heading as="h1" variant="h1">
              {reportTitle(report)}
            </Heading>
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
  return `${report.state} ${report.title}`;
};

export const renderReportSections = (
  reportPages: (ParentPageTemplate | FormPageTemplate | MeasurePageTemplate)[]
) => {
  // recursively render sections
  const renderSection = (
    section: ParentPageTemplate | FormPageTemplate | MeasurePageTemplate
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
        section: ParentPageTemplate | FormPageTemplate | MeasurePageTemplate,
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
