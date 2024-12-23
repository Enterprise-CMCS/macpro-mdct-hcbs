import { Button, Flex, Heading, Image, Text, Link } from "@chakra-ui/react";
import { Card, TemplateCardAccordion } from "components";
import { useNavigate } from "react-router-dom";
import { useBreakpoint, getSignedTemplateUrl, useStore } from "utils";
import { AnyObject } from "types";
import downloadIcon from "assets/icons/download/icon_download_primary.svg";
import nextIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import spreadsheetIcon from "assets/icons/spreadsheet/icon_spreadsheet_gray.svg";

export const downloadTemplate = async (templateName: string) => {
  const signedUrl = await getSignedTemplateUrl(templateName);
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("href", signedUrl);
  link.click();
  link.remove();
};

export const TemplateCard = ({
  templateName,
  verbiage,
  cardprops,
  isHidden,
  ...props
}: Props) => {
  const { isDesktop } = useBreakpoint();
  const navigate = useNavigate();
  const store = useStore();
  const user = store.user;
  const state = user?.state;
  const dashboardPath = verbiage.link.route.replace("{state}", state);

  return (
    <Card boxShadow="0px 3px 9px rgba(0, 0, 0, 0.2)" {...cardprops}>
      <Flex sx={sx.root} {...props}>
        {isDesktop && (
          <Image
            src={spreadsheetIcon}
            alt="Spreadsheet icon"
            sx={sx.spreadsheetIcon}
          />
        )}
        <Flex sx={sx.cardContentFlex} gap="1rem">
          <Heading sx={sx.cardTitleText}>{verbiage.title}</Heading>
          <Text>
            {verbiage.body.available}
            {/* <Link href={verbiage.linkLocation} isExternal>
              {verbiage.linkText}
            </Link> */}
            {verbiage.midText}
            <Link href={verbiage.linkLocation2} isExternal>
              {verbiage.linkText2}
            </Link>
            {/* {verbiage.postLinkText} */}
          </Text>
          <Flex sx={sx.actionsFlex}>
            {verbiage.downloadText && (
              <Button
                variant="link"
                sx={sx.templateDownloadButton}
                leftIcon={
                  <Image
                    src={downloadIcon}
                    alt="Download Icon"
                    height="1.5rem"
                  />
                }
                onClick={async () => {
                  await downloadTemplate(templateName);
                }}
              >
                {verbiage.downloadText}
              </Button>
            )}
            {!isHidden && (
              <Button
                onClick={() => navigate(dashboardPath)}
                rightIcon={
                  <Image src={nextIcon} alt="Link Icon" height="1rem" />
                }
              >
                {verbiage.link.text}
              </Button>
            )}
          </Flex>
          <TemplateCardAccordion verbiage={verbiage.accordion} />
          <Text sx={sx.textMargin}>Notes on when it's due</Text>
        </Flex>
      </Flex>
    </Card>
  );
};

interface Props {
  verbiage: AnyObject;
  isHidden?: boolean;
  [key: string]: any;
}

const sx = {
  root: {
    flexDirection: "row",
  },
  spreadsheetIcon: {
    marginRight: "2rem",
    boxSize: "5.5rem",
  },
  cardContentFlex: {
    width: "100%",
    flexDirection: "column",
  },
  cardTitleText: {
    marginBottom: "0.5rem",
    fontSize: "lg",
    fontWeight: "bold",
    lineHeight: "1.5",
  },
  actionsFlex: {
    flexFlow: "wrap",
    gridGap: "1rem",
    justifyContent: "space-between",
    margin: "1rem 0 0 1rem",
    ".mobile &": {
      flexDirection: "column",
    },
  },
  templateDownloadButton: {
    justifyContent: "start",
    marginRight: "1rem",
    padding: "0",
    span: {
      marginLeft: "0rem",
      marginRight: "0.5rem",
    },
    ".mobile &": {
      marginRight: "0",
    },
  },
  formLink: {
    justifyContent: "start",
    span: {
      marginLeft: "0.5rem",
      marginRight: "-0.25rem",
    },
  },
  textMargin: {
    paddingTop: "1rem",
  },
};
