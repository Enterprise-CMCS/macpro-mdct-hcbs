import { Accordion } from "@chakra-ui/react";
import { AccordionItem, ReportIntroCard } from "components";
import { ReportType } from "types";
import { ReportIntroCardActions } from "./ReportIntroCardActions";

/**
 * This card appears on the state user home page.
 * It contains text specific to the TACM report.
 */
export const TacmIntroductionCard = () => {
  return (
    <ReportIntroCard title="Timely Access Compliance Measure Report">
      The Timely Access Compliance Measures support the ongoing efforts to
      safeguard the health and welfare of HCBS participants by promoting quality
      monitoring and accountability across state systems. The compliance
      measures in this set assess state performance in key domains such as
      Homemaker, Home Health Aide, Personal Care, and Habilitation Services.
      These compliance measures are reported annually and help track whether
      states are effectively implementing quality strategies and delivering
      services that meet participant needs.
      <ReportIntroCardActions reportType={ReportType.TACM} />
      <Accordion allowToggle={true} defaultIndex={[-1]}>
        <AccordionItem label="When is the Timely Access Compliance Measure Report Due?">
          <p>
            The HCBS Timely Access Compliance Measure Report will be created and
            submitted ...
          </p>
          <p>
            The HCBS Timely Access Compliance Measure Report deadlines are TBD
            ...
          </p>
        </AccordionItem>
      </Accordion>
    </ReportIntroCard>
  );
};
