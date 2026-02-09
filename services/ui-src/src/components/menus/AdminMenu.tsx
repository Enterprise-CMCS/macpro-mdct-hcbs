import {
  Box,
  Button,
  Image,
  Link,
  Menu as MenuRoot,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { MenuOption } from "components";
import { useBreakpoint } from "utils";
import chevronDownIcon from "assets/icons/arrows/icon_arrow_down.svg";
import gearIcon from "assets/icons/icon_gear.svg";

export const AdminMenu = () => {
  const { isMobile } = useBreakpoint();
  return (
    <MenuRoot offset={[0, 20]}>
      <Box role="group">
        <MenuButton
          as={Button}
          rightIcon={
            <Image src={chevronDownIcon} alt="Arrow down" sx={sx.menuIcon} />
          }
          sx={sx.menuButton}
          aria-label="admin menu"
        >
          <MenuOption
            icon={gearIcon}
            altText=""
            text="Admin"
            hideText={isMobile}
          />
        </MenuButton>
      </Box>
      <MenuList sx={sx.menuList}>
        <Link as={RouterLink} to="/admin" variant="unstyled">
          <MenuItem sx={sx.menuItem}>
            <MenuOption role="button" text="Banner Editor" />
          </MenuItem>
        </Link>
      </MenuList>
    </MenuRoot>
  );
};

const sx = {
  menuButton: {
    padding: 0,
    paddingRight: "spacer1",
    marginLeft: "spacer1",
    borderRadius: 0,
    background: "none",
    color: "palette.white",
    fontWeight: "bold",
    _hover: { background: "none !important" },
    _active: { background: "none" },
    _focus: {
      boxShadow: "none",
      outline: "0px solid transparent !important",
    },
    ".mobile &": {
      marginLeft: 0,
    },
    "& .chakra-button__icon": {
      marginInlineStart: "0rem",
    },
  },
  menuList: {
    background: "palette.primary_darkest",
    padding: "0",
    border: "none",
    boxShadow: "0px 5px 16px rgba(0, 0, 0, 0.14)",
  },
  menuItem: {
    background: "palette.primary_darkest",
    borderRadius: ".375rem",
    _focus: { background: "palette.primary_darker" },
    _hover: { background: "palette.primary_darker" },
  },
  menuIcon: {
    width: "0.75rem",
  },
};
