import { Box, Button, Heading, Flex, Image } from "@chakra-ui/react";
import { useBreakpoint, useStore } from "utils";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";
import { ReactNode, useState } from "react";

const navItem = (title: string, index: number) => {
  if (index <= 0) return title;
  return (
    <Box paddingLeft="1rem" key={`${title}.${index}`}>
      {navItem(title, index - 1)}
    </Box>
  );
};

export const Sidebar = () => {
  const { report, pageMap, currentPageId, setCurrentPageId } = useStore();
  const { isDesktop } = useBreakpoint();
  const [isOpen, setIsOpen] = useState<boolean>(isDesktop);
  const [toggleList, setToggleList] = useState<{ [key: string]: boolean }>({});

  if (!report || !pageMap) {
    return null;
  }

  const setToggle = (sectonId: string) => {
    const list = toggleList;
    list[sectonId] = !toggleList[sectonId];
    setToggleList({ ...list });
  };

  const onNavSelect = (sectonId: string) => {
    setCurrentPageId(sectonId);
  };

  const navSection = (section: number, index: number = 0): ReactNode => {
    const page = report.pages[section];
    const childSections = page.childPageIds?.map((child) => pageMap.get(child));

    return (
      <Box key={page.id}>
        <Button
          variant={"sidebar"}
          className={page.id === currentPageId ? "selected" : ""}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box
              width="100%"
              height="100%"
              onClick={() => onNavSelect(page.id)}
            >
              {navItem(page.title!, index)}
            </Box>
            {childSections?.length! > 0 && (
              <Box onClick={() => setToggle(page.id)}>
                <Image
                  src={toggleList[page.id] ? arrowUpIcon : arrowDownIcon}
                  alt={
                    toggleList[page.id]
                      ? "Collapse subitems"
                      : "Expand subitems"
                  }
                />
              </Box>
            )}
          </Flex>
        </Button>
        {childSections?.length! > 0 &&
          toggleList[page.id] &&
          childSections!.map((sec) => navSection(sec!, index + 1))}
      </Box>
    );
  };

  const root = pageMap.get("root");
  if (root == undefined) return null;

  return (
    <Box sx={sx.sidebar} className={isOpen ? "open" : "closed"}>
      <Flex sx={sx.sidebarNav}>
        <Flex flexDirection="column" background="palette.gray_lightest">
          <Heading variant="sidebar">Quality Measures Report</Heading>
          {report.pages[root].childPageIds?.map((child) =>
            navSection(pageMap.get(child)!)
          )}
        </Flex>
        <Button
          aria-label="Open/Close sidebar menu"
          variant="sidebarToggle"
          onClick={() => setIsOpen(!isOpen)}
          className={isOpen ? "open" : "closed"}
        >
          <Image
            src={arrowDownIcon}
            alt={isOpen ? "Arrow left" : "Arrow right"}
            className={isOpen ? "left" : "right"}
          />
        </Button>
      </Flex>
    </Box>
  );
};

const sx = {
  sidebar: {
    position: "relative",
    transition: "all 0.3s ease",
    minWidth: "23rem",
    height: "100%",
    zIndex: "dropdown",
    "&.open": {
      marginLeft: "0rem",
    },
    "&.closed": {
      marginLeft: "-20.5rem",
    },
    ".tablet &": {
      position: "absolute",
    },
    ".mobile &": {
      position: "absolute",
    },
  },
  sidebarNav: {
    height: "100%",
    ".tablet &": {
      position: "fixed",
      display: "flex",
    },
    ".mobile &": {
      position: "fixed",
      display: "flex",
    },
  },
};
