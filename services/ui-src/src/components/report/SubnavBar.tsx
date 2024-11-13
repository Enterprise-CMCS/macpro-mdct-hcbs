import { Link as RouterLink, useParams } from "react-router-dom";
import { Flex, Container, Image, Link, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import checkIcon from "assets/icons/check/icon_check_gray.png";
import { ReportType } from "types/report";

export const SubnavBar = () => {
  const { reportType } = useParams();
  const { report, lastSavedTime } = useStore();
  const saveStatusText = "Last saved " + lastSavedTime;
  return (
    <Flex sx={sx.subnavBar}>
      <Container sx={sx.subnavContainer}>
        <Flex sx={sx.subnavFlex}>
          <Flex>
            <Text sx={sx.submissionNameText}>
              {reportType == ReportType.QM ? report?.state + " QMS Report" : ""}
            </Text>
          </Flex>
          <Flex sx={sx.subnavFlexRight}>
            {lastSavedTime && (
              <>
                <Image
                  src={checkIcon}
                  alt="gray checkmark icon"
                  sx={sx.checkIcon}
                />
                <Text sx={sx.saveStatusText}>{saveStatusText}</Text>
              </>
            )}
            <Link
              as={RouterLink}
              to={`/report/${report?.type}/${report?.state}` || "/"}
              sx={sx.leaveFormLink}
              variant="outlineButton"
              tabIndex={-1}
            >
              Leave form
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

const sx = {
  subnavBar: {
    position: "sticky",
    top: 0,
    zIndex: "sticky",
    bg: "palette.secondary_lightest",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  subnavContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  subnavFlex: {
    height: "60px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveFormLink: {
    marginLeft: "1rem",
  },
  checkIcon: {
    marginRight: "0.5rem",
    boxSize: "1rem",
    ".mobile &": {
      display: "none",
    },
  },
  submissionNameText: {
    fontWeight: "bold",
  },
  saveStatusText: {
    fontSize: "sm",
    ".mobile &": {
      width: "5rem",
      textAlign: "right",
    },
  },
  subnavFlexRight: {
    alignItems: "center",
    paddingRight: ".5rem",
  },
};
