// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Accordion, Link } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the QMS report.
 */
export const QmsIntroductionCard = () => {
  return (
    <ReportIntroCard title="Quality Measure Set Report">
      The HCBS Quality Measure Set supports ongoing efforts to safeguard the
      health and welfare of HCBS participants by promoting quality monitoring
      and accountability across state systems. The federally required
      performance measures (PMs) in this set assess state performance in key
      domains such as service planning, person-centeredness, health and welfare,
      and community integration. These PMs are reported annually and help track
      whether states are effectively implementing quality strategies and
      delivering services that meet participant needs. The HCBS Quality Measure
      Set PMs include both fee-for-service and managed care delivery systems.
      <ReportIntroCardActions reportType={ReportType.QMS} />
      <Accordion allowToggle={true}>
        <AccordionItem label="When is the Quality Measure Set Report due?">
          [CMS to provide]
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
