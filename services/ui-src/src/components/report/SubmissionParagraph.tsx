import { Stack, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import { getReportName } from "types";

export const SubmissionParagraph = () => {
  const { report } = useStore();
  if (!report || !report.submitted) return null;

  const submitted = new Date(report.submitted);

  const readableDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(submitted);
  const submissionText = `${getReportName(report.type)} submission for ${
    report.state
  } was submitted on ${readableDate} by ${report.submittedBy}.`;
  return (
    <Stack>
      <Text fontSize="heading_md" fontWeight="heading_md">
        Thank You
      </Text>
      <Text fontSize="body_md">{submissionText}</Text>
    </Stack>
  );
};
