import { Link as RouterLink } from "react-router-dom";
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link, Text } from "@chakra-ui/react";
import { Menu, MenuOption } from "components";
import { useStore, useBreakpoint } from "utils";
import appLogo from "assets/logos/logo_mdct_hcbs.svg";
import getHelpIcon from "assets/icons/help/icon_help_white.svg";
import checkIcon from "assets/icons/check/icon_check_gray.png";

export const Header = ({ handleLogout }: Props) => {
  const { lastSavedTime, report } = useStore();
  const { isMobile } = useBreakpoint();

  const saveStatusText = "Last saved " + lastSavedTime;

  return (
    <Box sx={sx.root} id="header">
      <Flex sx={sx.usaBannerContainer}>
        <UsaBanner />
      </Flex>
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/" variant="unstyled">
              <Image src={appLogo} alt="HCBS logo" sx={sx.appLogo} />
            </Link>
            <Flex sx={sx.menuFlex}>
              <Link
                as={RouterLink}
                to="/help"
                variant="unstyled"
                aria-label="Get Help"
              >
                <MenuOption
                  icon={getHelpIcon}
                  text="Get Help"
                  altText="Help"
                  role="group"
                  hideText={isMobile}
                />
              </Link>
              <Menu handleLogout={handleLogout} />
            </Flex>
          </Flex>
        </Container>
      </Flex>
      <Flex sx={sx.subnavBar}>
        <Container sx={sx.subnavContainer}>
          <Flex sx={sx.subnavFlex}>
            <Flex>
              <Text sx={sx.submissionNameText}>
                {report?.state + " QMS Report"}
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
    </Box>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: "sticky",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "@media print": {
      display: "none",
    },
  },
  usaBannerContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "palette.gray_lightest",
    ".desktop &": {
      padding: "0 1rem",
    },
  },
  headerBar: {
    minHeight: "4rem",
    alignItems: "center",
    bg: "palette.primary_darkest",
  },
  headerContainer: {
    maxW: "appMax",
    ".desktop &": {
      padding: "0 2rem",
    },
  },
  headerFlex: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuFlex: {
    alignItems: "center",
  },
  appLogo: {
    maxWidth: "200px",
  },
  subnavBar: {
    bg: "palette.secondary_lightest",
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
  subnavFlexRight: {
    alignItems: "center",
    paddingRight: ".5rem",
  },
  checkIcon: {
    marginRight: "0.5rem",
    boxSize: "1rem",
    ".mobile &": {
      display: "none",
    },
  },
  saveStatusText: {
    fontSize: "sm",
    ".mobile &": {
      width: "5rem",
      textAlign: "right",
    },
  },
  submissionNameText: {
    fontWeight: "bold",
  },
  leaveFormLink: {
    marginLeft: "1rem",
  },
};
