import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { getReportName } from "types";

export const SubmissionParagraph = () => {
  const { report } = useStore();
  if (!report || !report.lastSubmitted) return null;

  const submitted = new Date(report.lastSubmitted);

  const readableDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(submitted);
  const submissionText = `${getReportName(report.type)} submission for ${
    report.state
  } was submitted on ${readableDate} by ${report.submittedBy}.`;
  return (
    <Stack>
      <Text fontSize="16px" fontWeight="bold">
        Thank You
      </Text>
      <Text fontSize="16px">{submissionText}</Text>
    </Stack>
  );
};
