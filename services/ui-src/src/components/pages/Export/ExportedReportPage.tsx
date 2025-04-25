import { ComponentClass, useState } from "react";
import { Helmet as HelmetImport, HelmetProps } from "react-helmet";
import {
  Box,
  Center,
  Heading,
  Spinner,
  Flex,
  Checkbox,
} from "@chakra-ui/react";
import { useStore } from "utils";
import {
  FormPageTemplate,
  MeasurePageTemplate,
  ParentPageTemplate,
  Report,
  ReviewSubmitTemplate,
} from "types";
import { ExportedReportBanner, ExportedReportWrapper } from "components";

export const ExportedReportPage = () => {
  const { report } = useStore();
  const [displayHidden, setDisplayHidden] = useState(false);
  const reportPages = report?.pages;
  if (!reportPages) return null;

  //package import issue, can be removed once we get to react >= 18.3.0 and types/react >= 18.3.0
  const Helmet = HelmetImport as ComponentClass<HelmetProps>;

  return (
    <Box>
      <ExportedReportBanner />
      <Box sx={sx.container}>
        <Checkbox
          id="debug"
          checked={displayHidden}
          onChange={() => setDisplayHidden(!displayHidden)}
        >
          Debug
        </Checkbox>

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
            {/* report sections */}
            {renderReportSections(reportPages, displayHidden)}
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
  reportPages: (
    | ParentPageTemplate
    | FormPageTemplate
    | MeasurePageTemplate
    | ReviewSubmitTemplate
  )[],
  displayHidden: boolean
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
          <ExportedReportWrapper
            section={section}
            displayHidden={displayHidden}
          />
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
