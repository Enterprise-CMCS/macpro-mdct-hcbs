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
    <ReportIntroCard title="HCBS Quality Measure Set">
      The HCBS is ...
      <Link
        isExternal={true}
        href="https://www.govinfo.gov/content/pkg/PLAW-109publ171/pdf/PLAW-109publ171.pdf"
      >
        6071(a)(1) of the Deficit Reduction Act (DRA)
      </Link>
      as "increasing the use of home and community-based, rather than
      institutional, long-term care services."
      <ReportIntroCardActions reportType={ReportType.QMS} />
      <Accordion allowToggle={true}>
        <AccordionItem label="When is the HCBS Quality Measure Set due?">
          <p>The HCBS Quality Measure Set will be created and submitted ...</p>
          <p>The HCBS Quality Measure Set deadlines are TBD ...</p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
