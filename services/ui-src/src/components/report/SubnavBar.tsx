import { Link as RouterLink } from "react-router-dom";
import { Flex, Container, Image, Link, Text } from "@chakra-ui/react";
import { useStore } from "utils";
import checkIcon from "assets/icons/check/icon_check_gray.png";

export const SubnavBar = () => {
  const { report, lastSavedTime } = useStore();
  const saveStatusText = "Last saved " + lastSavedTime;

  return (
    <Flex sx={sx.subnavBar}>
      <Container sx={sx.subnavContainer}>
        <Flex sx={sx.subnavFlex}>
          <Flex>
            <Text sx={sx.submissionNameText}>
              {report ? ` ${report.name}` : ""}
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
              // oxlint-disable-next-line no-constant-binary-expression
              to={`/report/${report?.type}/${report?.state}` || "/"}
              sx={sx.leaveFormLink}
              variant="outlineButton"
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
    bg: "palette.secondary_lightest",
  },
  subnavContainer: {
    maxW: "appMax",
    ".desktop &": {
      paddingX: "spacer4",
    },
  },
  subnavFlex: {
    height: "60px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveFormLink: {
    marginLeft: "spacer2",
  },
  checkIcon: {
    marginRight: "spacer1",
    boxSize: "1rem",
    ".mobile &": {
      display: "none",
    },
  },
  submissionNameText: {
    fontWeight: "bold",
  },
  saveStatusText: {
    fontSize: "body_sm",
    ".mobile &": {
      width: "5rem",
      textAlign: "right",
    },
  },
  subnavFlexRight: {
    alignItems: "center",
  },
};
