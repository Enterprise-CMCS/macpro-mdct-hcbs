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
      The HCBS QMS report is now available. The HCBS QMS report is intended for
      use by states and reporting entities to submit data on the quality of
      services provided through Medicaid HCBS programs which support individuals
      who need long-term services and supports (LTSS) in their homes and
      communities rather than institutional settings. The purpose is to collect
      standardized data on the quality of HCBS programs and to support
      monitoring, improvement and accountability in Medicaid-funded HCBS. Each
      state or territory is required to submit one report for all
      Medicaid-funded HCBS under section 1915(c), (i), (j), and (k) authorities,
      as well as section 1115 demonstrations that include HCBS. Reporting must
      include all eligible individuals (or a representative sample of eligible
      individuals) receiving HCBS under these authorities.
      <ReportIntroCardActions reportType={ReportType.QMS} />
      <Accordion allowToggle={true}>
        <AccordionItem label="When is the Quality Measure Set Report Due?">
          The HCBS QMS report will be created and submitted biannually. CMS will
          review and approve all HCBS QMS reports. The reporting period will
          open on September 1 and close on December 31 during each year that
          states and territories are required to report.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
