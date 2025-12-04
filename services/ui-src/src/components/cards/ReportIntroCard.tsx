import { Flex, Heading, Image } from "@chakra-ui/react";
import { Card } from "components";
import { useBreakpoint } from "utils";
import spreadsheetIcon from "assets/icons/spreadsheet/icon_spreadsheet_gray.svg";
import { ReactNode } from "react";

/**
 * This card used on the state user home page.
 * Each report type has its own card,
 * describing the report and answering common questions (such as due date).
 * Each card will also contain a button to download the User Guide,
 * and a link to that report type's dashboard.
 */
export const ReportIntroCard = ({ title, children }: Props) => {
  const { isDesktop } = useBreakpoint();

  return (
    <Card boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)">
      <Flex sx={sx.root}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex}>
          <Heading sx={sx.cardTitleText}>{title}</Heading>
          {children}
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  title: string;
  children: ReactNode;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginRight: "spacer4",
    boxSize: "86px",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "spacer1",
    fontSize: "heading_lg",
    fontWeight: "heading_lg",
    lineHeight: "heading_lg",
  },
};
