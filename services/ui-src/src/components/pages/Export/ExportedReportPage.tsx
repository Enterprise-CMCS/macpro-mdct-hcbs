import { Helmet } from "react-helmet";
import { Box } from "@chakra-ui/react";

export const ExportedReportPage = () => {
  const metadata = { author: "", subject: "", language: "" };

  return (
    <Box>
      Export page
      <Helmet>
        <title></title>
        <meta name="author" content={metadata.author} />
        <meta name="subject" content={metadata.subject} />
        <meta name="language" content={metadata.language} />
      </Helmet>
    </Box>
  );
};
