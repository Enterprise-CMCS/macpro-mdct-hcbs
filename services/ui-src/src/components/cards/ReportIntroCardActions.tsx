import { Button, Flex, Image, Link } from "@chakra-ui/react";
import downloadIcon from "assets/icons/download/icon_download_primary.svg";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import { useNavigate } from "react-router-dom";
import { ReportType, isReportType } from "types";
import { getSignedTemplateUrl, useStore } from "utils";

/**
 * This component is contained within each card on the state user home page.
 * It has a link to that report type's dashboard.
 */
export const ReportIntroCardActions = ({ reportType }: Props) => {
  const navigate = useNavigate();
  const state = useStore().user?.state;
  const dashboardRoute = `/report/${reportType}/${state}`;

  const getAbbreviation = (reportType: string) => {
    if (!isReportType(reportType)) return "";
    switch (reportType) {
      case ReportType.CI:
        return "CI";
      case ReportType.QMS:
        return "QMS";
      case ReportType.TACM:
        return "TACM";
      case ReportType.PCP:
        return "PCP";
      case ReportType.WWL:
        return "WWL";
    }
  };

  return (
    <Flex sx={sx.actionsFlex}>
      <Button
        variant="link"
        sx={sx.userGuideDownloadButton}
        leftIcon={
          <Image src={downloadIcon} alt="Download Icon" height="1.5rem" />
        }
        onClick={async () => {
          await downloadUserGuide(reportType);
        }}
      >
        User Guide and Help File
      </Button>
      <Button
        as={Link}
        variant={"primary"}
        href={`/report/${reportType}/${state}`}
        onClick={(e) => {
          e.preventDefault();
          navigate(dashboardRoute);
        }}
        rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
        sx={sx.link}
      >
        Enter {getAbbreviation(reportType)} Report online
      </Button>
    </Flex>
  );
};

export const downloadUserGuide = async (reportType: ReportType) => {
  const signedUrl = await getSignedTemplateUrl(reportType);
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", String(signedUrl));
  link.click();
  link.remove();
};

interface Props {
  reportType: ReportType;
}

const sx = {
  actionsFlex: {
    flexFlow: "no-wrap",
    justifyContent: "end",
    marginY: "spacer3",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  link: {
    textDecoration: "none",
    "&:visited, &:visited:hover": {
      color: "white",
      textDecoration: "none",
    },
    "&:hover": {
      color: "white",
      textDecoration: "none",
      backgroundColor: "palette.primary_darker",
    },
  },
  userGuideDownloadButton: {
    justifyContent: "start",
    marginRight: "1rem",
    padding: "0",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
};
