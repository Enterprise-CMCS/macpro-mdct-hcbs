import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

export const WWLIntroductionCard = () => {
  const name = "Waiver Waiting List Report";

  return (
    <ReportIntroCard title={name}>
      [Placeholder Summary]
      <ReportIntroCardActions reportType={ReportType.WWL} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label={`When is the ${name} Due?`}>
          <p>The HCBS {name} will be created and submitted ...</p>
          <p>The HCBS {name} deadlines are TBD ...</p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
