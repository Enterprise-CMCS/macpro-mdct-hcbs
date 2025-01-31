import { Accordion, Link } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the CI report.
 */
export const CiIntroductionCard = () => {
  return (
    <ReportIntroCard title="HCBS Critical Incident Report">
      The HCBS is ...
      <Link
        isExternal={true}
        href="https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf"
      >
        6071(a)(1) of the Deficit Reduction Act (DRA)
      </Link>
      as "increasing the use of home and community-based, rather than
      institutional, long-term care services."
      <ReportIntroCardActions reportType={ReportType.CI} />
      <Accordion allowToggle={true}>
        <AccordionItem label="When is the HCBS Critical Incident Report due?">
          <p>The HCBS Critical Incident will be created and submitted ...</p>
          <p>The HCBS Critical Incident deadlines are TBD ...</p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
