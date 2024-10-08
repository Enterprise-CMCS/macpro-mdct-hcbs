import { Flex, Image, Link, Text } from "@chakra-ui/react";
import { Card } from "components";
import { useBreakpoint } from "utils";
import { AnyObject } from "types";
import { createEmailLink } from "utils/other/email";
import spreadsheetIcon from "assets/icons/spreadsheet/icon_spreadsheet_gray.svg";
import settingsIcon from "assets/icons/icon_wrench_gear.svg";

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

export const EmailCard = ({ verbiage, icon, cardprops, ...props }: Props) => {
  const { isDesktop } = useBreakpoint();

  return (
    <Card
      boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)"
      {...cardprops}
      paddingBottom="1.5rem !important"
    >
      <Flex sx={sx.root} {...props}>
        <Image src={iconMap[icon].image} alt={iconMap[icon].alt} sx={sx.icon} />
        <Flex sx={sx.cardContentFlex}>
          <Text sx={sx.bodyText}>{verbiage.body}</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={createEmailLink(verbiage.email)} target="_blank">
              {verbiage.email.address}
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: AnyObject;
  icon: keyof typeof iconMap;
  [key: string]: any;
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
