import { Box, Text, Button, Image } from "@chakra-ui/react";
import pdfIcon from "assets/icons/pdf/icon_pdf_white.svg";
import { useStore } from "utils";
import qmVerbiage from "verbiage/export/qm-export";

export const ExportedReportBanner = () => {
  const { report } = useStore();
  const { reportBanner } = qmVerbiage;

  console.log("report", report);

  const onClickHandler = () => {
    window?.print();
  };

  return (
    <Box data-testid="exportedReportBanner" sx={sx.container}>
      <Text>{report?.title}</Text>
      <Button sx={sx.pdfButton} onClick={onClickHandler}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        {reportBanner.pdfButton}
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    position: "sticky",
    zIndex: "sticky",
    top: "0",
    marginBottom: "2rem",
    padding: "2rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    "@media print": {
      display: "none",
    },
    p: {
      marginBottom: "1rem",
      fontSize: "xl",
      fontWeight: "bold",
      ".mobile &": {
        fontSize: "lg",
      },
    },
  },
  pdfButton: {
    img: {
      width: "1rem",
      marginRight: "0.5rem",
    },
  },
};
