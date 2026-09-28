import { Button, Flex, Image, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@cmsgov/design-system";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import { useNavigate } from "react-router-dom";
import { ReportType, isReportType } from "types";
import { externalLinkAltText, useStore } from "utils";

/**
 * This component is contained within each card on the state user home page.
 * It has a link to that report type's dashboard.
 */
export const ReportIntroCardActions = ({ reportType }: Props) => {
  const navigate = useNavigate();
  const state = useStore().user?.state;
  const dashboardRoute = `/report/${reportType}/${state}`;

  const getReportName = (reportType: string) => {
    if (!isReportType(reportType)) return "";
    switch (reportType) {
      case ReportType.CI:
        return "CI Report";
      case ReportType.QMS:
        return "QMS Report";
      case ReportType.HA:
        return "HA Report";
      case ReportType.PCP:
        return "PCP Report";
      case ReportType.IMA:
        return "IMA";
      case ReportType.QIP:
        return "QMS QIP";
      case ReportType.WWL:
        return "WWL Report";
    }
  };

  const helpFiles: { [key in ReportType]?: string } = {
    QMS: "CMS_QMS_User_Guide_and_Help_File.pdf",
  };

  return (
    <Flex sx={reportType in helpFiles ? sx.actionsFlex : sx.actionsFlexEnd}>
      {reportType in helpFiles && (
        <Button
          as={Link}
          variant="link"
          sx={sx.userGuideDownloadButton}
          href={`${window.location.origin}/${helpFiles[reportType]}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          User Guide and Help File
          <ExternalLinkIcon
            ariaHidden={false}
            title={externalLinkAltText}
            className="external-link-icon"
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
        Enter {getReportName(reportType)} online
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
    // Prevent icon clipping in button.
    ".external-link-icon": {
      marginBottom: "0.05em",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
};
