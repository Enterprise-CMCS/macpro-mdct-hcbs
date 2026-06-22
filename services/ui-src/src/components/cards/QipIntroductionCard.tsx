import { Accordion } from "@chakra-ui/react";
import { AccordionItem } from "components/accordions/AccordionItem";
import { ReportIntroCard } from "./ReportIntroCard";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

export const QipIntroductionCard = () => {
  return (
    <ReportIntroCard title="QMS Quality Improvement Plans">
      The QMS Quality Improvement Plans (QIP) allow states to document, track,
      and submit initiatives aimed at enhancing the delivery and outcomes of
      HCBS programs. This report captures structural interventions, systemic
      remediation plans, and measurable progress against identified performance
      gaps. Submissions are required annually to support continuous quality
      improvement frameworks across all applicable authorities.
      <ReportIntroCardActions reportType={ReportType.QIP} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When are the Quality Improvement Plans Due?">
          The QMS QIP will be created and submitted biannually. CMS will review
          and approve all QMS QIPs. The reporting period will open on September
          1 and close on December 31 during each year that states and
          territories are required to report.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
