import { Box, Button, Heading, Flex, Image } from "@chakra-ui/react";
import { useStore } from "utils";
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
  const [isOpen, setIsOpen] = useState<boolean>(true);
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
          variant={page.id === currentPageId ? "sidebarSelected" : "sidebar"}
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
    <Flex height="100%">
      {isOpen && (
        <Flex flexDirection="column" background="palette.gray_lightest">
          <Heading variant="sidebar">Quality Measures Report</Heading>
          {report.pages[root].childPageIds?.map((child) =>
            navSection(pageMap.get(child)!)
          )}
        </Flex>
      )}
      <Button
        aria-label="Open/Close sidebar menu"
        variant="sidebarToggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={arrowDownIcon}
          alt={isOpen ? "Arrow left" : "Arrow right"}
          className={isOpen ? "left" : "right"}
        />
      </Button>
    </Flex>
  );
};
