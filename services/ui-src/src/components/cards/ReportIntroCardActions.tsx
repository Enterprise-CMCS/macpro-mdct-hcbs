import { Button, Flex, Image } from "@chakra-ui/react";
import downloadIcon from "assets/icons/download/icon_download_primary.svg";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import { useNavigate } from "react-router-dom";
import { ReportType } from "types";
import { getSignedTemplateUrl, useStore } from "utils";

/**
 * This component is contained within each card on the stat user home page.
 * It has a button to download the user guide for that report type,
 * and a link to that report type's dashboard.
 */
export const ReportIntroCardActions = ({ reportType }: Props) => {
  const navigate = useNavigate();
  const state = useStore().user?.state;
  const dashboardRoute = `/report/${reportType}/${state}`;

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
      {/* TODO: this Button is for navigation, so it maybe should be a Link instead. */}
      <Button
        onClick={() => navigate(dashboardRoute)}
        rightIcon={<Image src={nextIcon} alt="Link Icon" height="1rem" />}
      >
        Enter HCBS {reportType} online
      </Button>
    </Flex>
  );
};

export const downloadUserGuide = async (reportType: ReportType) => {
  const signedUrl = await getSignedTemplateUrl(reportType);
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", signedUrl);
  link.click();
  link.remove();
};

interface Props {
  reportType: ReportType;
}

const sx = {
  actionsFlex: {
    flexFlow: "wrap",
    gridGap: "1rem",
    justifyContent: "space-between",
    margin: "1rem 0 0 1rem",
    ".mobile &": {
      flexDirection: "column",
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
