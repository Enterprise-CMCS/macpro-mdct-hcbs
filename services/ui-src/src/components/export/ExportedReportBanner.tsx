import { Box, Text, Button, Image } from "@chakra-ui/react";
import pdfIcon from "assets/icons/pdf/icon_pdf_white.svg";

interface Props {
  reportName: string;
}

export const ExportedReportBanner = ({ reportName }: Props) => {
  const onClickHandler = () => {
    window?.print();
  };

  return (
    <Box sx={sx.container}>
      <Text>Click below to export or print {reportName} shown here</Text>
      <Button sx={sx.pdfButton} onClick={onClickHandler}>
        <Image src={pdfIcon} w={5} alt="PDF Icon" />
        Download PDF
      </Button>
    </Box>
  );
};

const sx = {
  container: {
    position: "sticky",
    zIndex: "sticky",
    top: "0",
    marginBottom: "3rem",
    padding: "2rem 2rem",
    background: "white",
    boxShadow: "0px 3px 9px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    ".mobile &": {
      padding: "2rem 1rem",
    },
    ".tablet &, .mobile &": {
      position: "static",
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
