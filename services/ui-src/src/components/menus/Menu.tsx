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
import accountCircleIcon from "assets/icons/account/icon_account_circle.svg";
import chevronDownIcon from "assets/icons/arrows/icon_arrow_down.svg";
import logoutIcon from "assets/icons/logout/icon_logout.svg";
import editIcon from "assets/icons/edit/icon_edit_square_white.svg";

export const Menu = ({ handleLogout }: Props) => {
  const { isMobile } = useBreakpoint();
  return (
    <MenuRoot offset={[8, 20]}>
      <Box role="group">
        <MenuButton
          as={Button}
          rightIcon={
            <Image src={chevronDownIcon} alt="Arrow down" sx={sx.menuIcon} />
          }
          sx={sx.menuButton}
          aria-label="my account"
        >
          <MenuOption
            icon={accountCircleIcon}
            altText="Account"
            text="My Account"
            hideText={isMobile}
          />
        </MenuButton>
      </Box>
      <MenuList sx={sx.menuList}>
        <Link as={RouterLink} to="/profile" variant="unstyled">
          <MenuItem sx={sx.menuItem}>
            {/*
             * TODO: Will a screen reader announce this
             * as "manage account manage account?"
             * We may need to tone down the alt text.
             */}
            <MenuOption
              icon={editIcon}
              altText="Manage account"
              text="Manage Account"
            />
          </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout} sx={sx.menuItem} tabIndex={0}>
          <MenuOption icon={logoutIcon} text="Log Out" altText="Logout" />
        </MenuItem>
      </MenuList>
    </MenuRoot>
  );
};

interface Props {
  handleLogout: () => void;
}

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
