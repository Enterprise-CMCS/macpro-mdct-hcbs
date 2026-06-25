import { Accordion, Link, Text } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

export const QipIntroductionCard = () => {
  return (
    <ReportIntroCard title="QMS Quality Improvement Plans">
      <Text>
        The Quality Improvement Plans (QIP) form is intended to capture
        information about MFP grant recipients’ QI targets and strategies. MFP
        grant recipients are required to establish performance targets and
        develop QI strategies for meeting the performance targets beginning in
        fall 2026. CMS will use this information to assess MFP grant recipients’
        progress toward improving HCBS quality, identify opportunities for
        support, and inform future guidance and policy development. Please see
        the accompanying Help File for additional guidance regarding how to
        complete each section of this form. Questions about this form or
        requests for technical assistance may be directed to{" "}
        <Link href="mailto:HCBSQuality@cms.hhs.gov" isExternal>
          HCBSQuality@cms.hhs.gov
        </Link>
        .
      </Text>
      <ReportIntroCardActions reportType={ReportType.QIP} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When are the Quality Improvement Plans Due?">
          MFP grant recipients are required to develop QIPs for meeting the
          performance targets for two mandatory measures beginning in Fall 2026.
          Regulations require that, beginning in July 2028, all states report on
          their QMS Quality Improvement Plans, every other year, that they will
          pursue to achieve performance targets. The reporting period will open
          on or about September 1 and close on or about December 31 during each
          year that states and territories are required to report.
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
