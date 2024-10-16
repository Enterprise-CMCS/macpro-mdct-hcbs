import { Box, Button, Heading, Flex, Image } from "@chakra-ui/react";
import { useStore } from "utils";
import { PageTemplate } from "../../types/report";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";
import { useState } from "react";

const navItem = (title: string, index: number) => {
  if (index <= 0) return title;
  return (
    <Box paddingLeft="1rem" key={`${title}.${index}`}>
      {navItem(title, index - 1)}
    </Box>
  );
};

export const Sidebar = () => {
  const { report, pageMap, setCurrentPageId } = useStore();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [toggleList, setToggleList] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<string>();

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
    setSelected(sectonId);
  };

  const navSection = (
    section: PageTemplate,
    index: number = 0
  ): React.ReactNode => {
    const childSections = section.childPageIds?.map((child) =>
      pageMap.get(child)
    );

    return (
      <Box key={section.id}>
        <Button
          variant={section.id === selected ? "sidebarSelected" : "sidebar"}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Box
              width="100%"
              height="100%"
              onClick={() => onNavSelect(section.id)}
            >
              {navItem(section.title!, index)}
            </Box>
            {childSections?.length! > 0 && (
              <Box onClick={() => setToggle(section.id)}>
                <Image
                  src={toggleList[section.id] ? arrowUpIcon : arrowDownIcon}
                  alt={
                    toggleList[section.id]
                      ? "Collapse subitems"
                      : "Expand subitems"
                  }
                />
              </Box>
            )}
          </Flex>
        </Button>
        {childSections?.length! > 0 &&
          toggleList[section.id] &&
          childSections!.map((sec) => navSection(sec!, index + 1))}
      </Box>
    );
  };

  return (
    <Flex height="100%">
      {isOpen && (
        <Flex flexDirection="column" background="palette.gray_lightest">
          <Heading variant="sidebar">Quality Measures Report</Heading>
          {pageMap
            .get("root")
            ?.childPageIds?.map((child) => navSection(pageMap.get(child)!))}
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
