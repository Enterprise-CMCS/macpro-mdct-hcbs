import { Link as RouterLink, useLocation } from "react-router-dom";
import { UsaBanner } from "@cmsgov/design-system";
import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
import { AccountMenu, AdminMenu, MenuOption, SubnavBar } from "components";
import { useBreakpoint, useStore } from "utils";
import appLogo from "assets/logos/logo_mdct_hcbs.svg";
import getHelpIcon from "assets/icons/help/icon_help_white.svg";

export const Header = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  const { pathname } = useLocation();
  const { userIsAdmin } = useStore().user ?? {};
  const paths = pathname.split("/");
  return (
    <Box sx={sx.root} id="header">
      <Flex sx={sx.usaBannerContainer}>
        <UsaBanner />
      </Flex>
      <header>
        <Flex sx={sx.headerBar}>
          <Container sx={sx.headerContainer}>
            <Flex sx={sx.headerFlex}>
              <Link as={RouterLink} to="/" variant="unstyled">
                <Image src={appLogo} alt="HCBS logo" sx={sx.appLogo} />
              </Link>
              <Flex sx={sx.menuFlex}>
                {userIsAdmin ? <AdminMenu /> : null}
                <Link
                  as={RouterLink}
                  to="/help"
                  variant="unstyled"
                  aria-label="Get Help"
                  sx={sx.getHelp}
                >
                  <MenuOption
                    icon={getHelpIcon}
                    text="Get Help"
                    altText="Help"
                    role="group"
                    hideText={isMobile}
                  />
                </Link>
                <AccountMenu handleLogout={handleLogout} />
              </Flex>
            </Flex>
          </Container>
        </Flex>
        {/* report-related pages have more than 4 path segments */}
        {paths.length > 4 && <SubnavBar />}
      </header>
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
    padding: "0 1rem",
    "& .ds-c-usa-banner__header-icon": {
      width: "2rem",
      height: "0.6875rem",
      alignSelf: "center",
      verticalAlign: "middle",
    },
    "& .ds-c-usa-banner__action-icon": {
      width: "0.75rem",
      height: "0.75rem",
    },
    "& .ds-c-usa-banner__button-icon": {
      width: "0.875rem",
      height: "0.875rem",
    },
    "& .ds-c-usa-banner__guidance-icon": {
      width: "1.5rem",
      height: "1.5rem",
    },
    "& .ds-c-usa-banner__inline-lock-icon": {
      display: "inline",
      width: "0.65rem",
      height: "0.8rem",
    },
    "& .ds-c-usa-banner__button-text": {
      alignItems: "center",
      paddingInlineStart: "0.2rem",
    },
    "@media (min-width: 768px)": {
      "& .ds-c-usa-banner__action": {
        display: "none",
      },
      "& .ds-c-usa-banner__button-text": {
        display: "flex",
      },
    },
    ".desktop &": {
      padding: "0 2rem",
    },

    header: {
      display: "grid",
      ".desktop &": {
        display: "flex",
      },
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
    maxWidth: "238px",
  },
  getHelp: {
    marginLeft: ".5rem",
  },
};
