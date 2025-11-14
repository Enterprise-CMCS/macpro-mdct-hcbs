import { Text } from "@chakra-ui/react";

// Privacy Rights Act Disclosure - 1st page of reports
const praStatement =
  "Under the Privacy Act of 1974 any personally identifying information obtained will be kept private to the extent of the law. According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-1053. The time required to complete this information collection is estimated to average 2.5 hours per response, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850";

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
