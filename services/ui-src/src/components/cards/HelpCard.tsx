import { Flex, Image } from "@chakra-ui/react";
import { Card } from "components";
import spreadsheetIcon from "assets/icons/spreadsheet/icon_spreadsheet_gray.svg";
import settingsIcon from "assets/icons/icon_wrench_gear.svg";
import { ComponentProps } from "react";

const iconMap = {
  spreadsheet: {
    image: spreadsheetIcon,
    alt: "spreadsheet icon",
  },
  settings: {
    image: settingsIcon,
    alt: "settings icon",
  },
};

export const HelpCard = ({ icon, children }: Props) => {
  return (
    <Card
      boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)"
      paddingBottom="1.5rem !important"
    >
      <Flex sx={sx.root}>
        <Image src={iconMap[icon].image} alt={iconMap[icon].alt} sx={sx.icon} />
        <Flex sx={sx.cardContentFlex}>{children}</Flex>
      </Flex>
    </Card>
  );
};

interface Props extends Pick<ComponentProps<typeof Flex>, "children"> {
  icon: keyof typeof iconMap;
}

const sx = {
  root: {
    flexDirection: "row",
    textAlign: "left",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  icon: {
    marginRight: "2rem",
    boxSize: "78px",
    ".mobile &": {
      alignSelf: "center",
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
  },
  bodyText: {
    marginBottom: "1rem",
  },
  emailText: {
    fontWeight: "bold",
  },
};
