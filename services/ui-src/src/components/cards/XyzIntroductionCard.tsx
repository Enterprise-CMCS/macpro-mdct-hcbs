import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportIntroCardActions } from "./ReportIntroCardActions";
import { ReportType } from "types";

/**
 * This card appears on the state user home page.
 * It contains text specific to the XYZ report.
 */
export const XyzIntroductionCard = () => {
  return (
    <ReportIntroCard title="XYZ Report">
      The XYZ report is a demonstration report for the MDCT LABS application.
      This report showcases core functionality common across modern MDCT
      applications, including report creation, data entry, validation, and
      submission workflows. Use this report to explore the standard patterns
      used throughout the MDCT ecosystem.
      <ReportIntroCardActions reportType={ReportType.XYZ} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the XYZ Report Due?">
          The XYZ report is a demonstration report for testing and development
          purposes. In a production environment, reporting periods and deadlines
          would be configured based on program requirements. For LABS, this
          report is available at any time for exploring MDCT patterns and
          workflows.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
