import { Link as RouterLink, useLocation } from "react-router-dom";
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
import { Menu, MenuOption, SubnavBar } from "components";
import { useBreakpoint } from "utils";
import appLogo from "assets/logos/logo_mdct_labs.svg";
import getHelpIcon from "assets/icons/help/icon_help_white.svg";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const { pathname } = useLocation();
  const paths = pathname.split("/");
  return (
    <Box sx={sx.root} id="header">
      <Flex sx={sx.usaBannerContainer}>
        <UsaBanner />
      </Flex>
      <Flex sx={sx.headerBar} role="navigation">
        <Container sx={sx.headerContainer}>
          <Flex sx={sx.headerFlex}>
            <Link as={RouterLink} to="/" variant="unstyled">
              <Image src={appLogo} alt="LABS logo" sx={sx.appLogo} />
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
      {paths.length > 4 && (
        <SubnavBar reportType={paths[2]} stateName={paths[3]} />
      )}
    </Box>
  );
};

interface Props {
  handleLogout: () => void;
}

const sx = {
  root: {
    position: "sticky",
    zIndex: "sticky",
    top: 0,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    "@media print": {
      display: "none",
    },
    ".tablet &, .mobile &": {
      position: "static",
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
};
