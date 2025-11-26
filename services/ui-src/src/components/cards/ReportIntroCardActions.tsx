import { Button, Flex, Image, Link } from "@chakra-ui/react";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import externalLinkIcon from "assets/icons/externalLink/icon_external_link_main.svg";
import { useNavigate } from "react-router-dom";
import { ReportType, isReportType } from "types";
import { useStore } from "utils";

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

  const helpFiles: { [key: string]: string } = {
    QMS: "CMS_QMS_User_Guide_and_Help_File",
  };

  return (
    <Flex sx={reportType in helpFiles ? sx.actionsFlex : sx.actionsFlexEnd}>
      {reportType in helpFiles && (
        <Button
          as={Link}
          variant="link"
          sx={sx.userGuideDownloadButton}
          href={`/public/${helpFiles[reportType]}.pdf`}
          target="_blank"
        >
          User Guide and Help File
          <Image
            src={externalLinkIcon}
            sx={sx.externalLinkIcon}
            alt="External Link Icon"
          />
        </Button>
      )}
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

interface Props {
  reportType: ReportType;
}

const sx = {
  actionsFlex: {
    flexFlow: "no-wrap",
    justifyContent: "space-between",
    marginY: "spacer3",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  actionsFlexEnd: {
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
  externalLinkIcon: {
    marginLeft: "0.5rem",
    height: "1rem",
  },
  downloadIcon: {
    marginRight: "0.5rem",
  },
};
