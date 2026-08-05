import { Accordion, Text } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

export const IMAIntroductionCard = () => {
  return (
    <ReportIntroCard title="Incident Management Assessments">
      <Text>
        The Incident Management Assessments (IMA) are a comprehensive evaluation framework designed to help state Medicaid 
        agencies measure the effectiveness of their systems for tracking, investigating, and mitigating critical incidents 
        (such as abuse, neglect, and exploitation) within Home and Community-Based Services (HCBS) programs. By analyzing core 
        pillars of people, process, and technology, the tool helps states identify operational gaps, ensure compliance with 
        federal CMS health and welfare assurances, and leverage data-driven insights to better protect vulnerable populations.
      </Text>
      <ReportIntroCardActions reportType={ReportType.IMA} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When are the Incident Management Assessments Due?">
            In accordance with 42 CFR § 441.311(b), beginning July 9, 2027, every 24 months, states must report on the results of 
            an Incident Management Assessment (IMA).  CMS may reduce the frequency to once every 60 months once the state is 
            determined to be compliant with the requirements at 42 CFR § 441.302(a)(6). The reporting period will open on 
            September 1 and close on December 31 during each year that states and territories are required to report.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
