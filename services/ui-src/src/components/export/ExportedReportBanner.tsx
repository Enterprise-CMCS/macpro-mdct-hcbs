import { Box, Text, Button, Image } from "@chakra-ui/react";
import pdfIcon from "assets/icons/pdf/icon_pdf_white.svg";

export const ExportedReportBanner = () => {
  return (
    <Box data-testid="exportedReportBanner">
      <Text>Report Banner Intro</Text>
      <Button>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        {/* {reportBanner.pdfButton} */}
      </Button>
    </Box>
  );
};
