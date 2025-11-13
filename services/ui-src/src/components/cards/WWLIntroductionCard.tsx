import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the TACM report.
 */
export const WWLIntroductionCard = () => {
  return (
    <ReportIntroCard title="Waiver Waiting List Report">
      The Waiver Waiting List (WWL) report promotes the transparency of HCBS
      waiver waiting lists by giving the public information on access to these
      essential services. Reports, submitted by waiting list, should include
      information about the number of people on the waiting list, as well as
      certain eligibility assessments, and length of time on the waiting list.
      <ReportIntroCardActions reportType={ReportType.WWL} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the Waiver Waiting List Report due?">
          <p>
            The HCBS WWL report will be created and submitted annually for each
            applicable waiting list. CMS will then review and approve all HCBS
            WWL reports. The reporting period will open on September 1 and close
            on December 31 during each year that states and territories are
            required to report.
          </p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
