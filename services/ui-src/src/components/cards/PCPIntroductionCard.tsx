import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the PCP report.
 */
export const PCPIntroductionCard = () => {
  const name = "Person-Centered Planning Report";

  return (
    <ReportIntroCard title={name}>
      The Person-Centered Planning (PCP) compliance measures support the ongoing
      efforts to safeguard the health and welfare of HCBS participants by
      promoting quality monitoring and accountability across state systems. The
      measures in this set assess state performance in key domains such as
      patient planning and the reassessment of functional needs. These
      compliance measures are reported annually and help track whether states
      are effectively implementing quality strategies and delivering services
      that meet participant needs.
      <ReportIntroCardActions reportType={ReportType.PCP} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label={`When is the ${name} Due?`}>
          The HCBS PCP report will be created and submitted annually. CMS will
          review and approve all HCBS PCP reports. The reporting period will
          open on September 1 and close on December 31 during each year that
          states and territories are required to report.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
