import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the PCP report.
 */
export const PCPIntroductionCard = () => {
  const name = "Person-Centered Planning";

  return (
    <ReportIntroCard title={name}>
      [Placeholder Summary]
      <ReportIntroCardActions reportType={ReportType.PCP} />
      <Accordion allowToggle={true}>
        <AccordionItem label={`When is the ${name} Report Due?`}>
          <p>The HCBS {name} will be created and submitted ...</p>
          <p>The HCBS {name} deadlines are TBD ...</p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
