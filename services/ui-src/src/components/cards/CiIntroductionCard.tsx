import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the CI report.
 */
export const CiIntroductionCard = () => {
  return (
    <ReportIntroCard title="Critical Incident Report">
      The Critical Incident Reporting requirements strengthen safeguards to
      ensure health and welfare for HCBS participants and enhance state incident
      management systems. The three federally prescribed performance measures
      (PMs) for Critical Incident Reporting capture state efforts to ensure
      critical incidents are appropriately reported, investigated, resolved, and
      (if required) subjected to corrective action within state-specified
      timeframes. These PMs are reported annually and are subject to a 90
      percent minimum performance level. The PMs are aggregated across all
      applicable HCBS authorities and programs and apply to both FFS and managed
      care delivery systems.
      <ReportIntroCardActions reportType={ReportType.CI} />
      <Accordion allowToggle={true}>
        <AccordionItem label="When is the Critical Incident Report Due?">
          <p>The HCBS Critical Incident will be created and submitted ...</p>
          <p>The HCBS Critical Incident deadlines are TBD ...</p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
