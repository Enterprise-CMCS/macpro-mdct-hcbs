import { Text } from "@chakra-ui/react";

// Privacy Rights Act Disclosure - 1st page of reports
const praStatement =
  "Under the Privacy Act of 1974, any personally identifying information obtained will be kept private to the extent permitted by law. According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. This information collection has been approved under OMB Control No. 0938-1148 (expiration date: August 31, 2029). The estimated time required to enter, validate, and submit the HCBS Quality Measure Set (QMS) and associated Quality Improvement Plan (QIP) reporting information through MDCT is three hours per state or territory for the 2026 reporting cycle. The estimated total burden for the 2026 reporting cycle is 125 hours per state or territory, including the three hours for MDCT reporting. This broader estimate also accounts for data collection, measure calculation, analysis, preparation and review of reporting information, and executive review and approval. If you have comments concerning the accuracy of the time estimates or suggestions for improving the forms, please write to CMS, 7500 Security Boulevard, Attention: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850.";

export const PraDisclosure = () => {
  return (
    <>
      <Text fontSize="heading_md" fontWeight="heading_md">
        PRA Disclosure Statement
      </Text>
      <Text fontSize="body_md">{praStatement}</Text>
    </>
  );
};
