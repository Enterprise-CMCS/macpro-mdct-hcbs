import { Box, Button, Heading, Flex, Text, Image } from "@chakra-ui/react";
import { useStore } from "utils";
import { AnyObject } from "yup/lib/types";
import { ParentPageTemplate } from "../../types/report";
import { useState } from "react";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";

const navItemText = (title: string, index: number) => {
  if (index <= 0) return title;
  return <Box paddingLeft="1rem">{navItemText(title, index - 1)}</Box>;
};

const navItem = (
  page: AnyObject,
  index: number,
  isToggle: boolean,
  func: Function
) => {
  const [section, setSection] = useState<boolean>(true);
  return (
    <Button variant="sidebar" key={page.id}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box onClick={() => func(page.id)} width="100%" height="100%">
          {navItemText(page.title!, index)}
        </Box>
        <Box onClick={() => setSection(!section)}>
          {isToggle && (
            <Image
              src={section ? arrowDownIcon : arrowUpIcon}
              alt={section ? "Arrow left" : "Arrow right"}
            />
          )}
        </Box>
      </Flex>
    </Button>
  );
};

export const Sidebar = () => {
  const { report, pageMap, setCurrentPageId } = useStore();

  if (!report || !pageMap) {
    return null;
  }
  const buildNavList = (
    pageIds: string[],
    layer: number = 0
  ): JSX.Element[] => {
    const builtList = [];
    for (const child of pageIds) {
      const page = pageMap.get(child) as ParentPageTemplate;
      builtList.push(
        navItem(page, layer, !!page.childPageIds, setCurrentPageId)
      );
      if (page.childPageIds) {
        builtList.push(buildNavList(page.childPageIds, layer + 1));
      }
    }
    return builtList as JSX.Element[];
  };

  const navList = buildNavList(
    (pageMap.get("root") as ParentPageTemplate).childPageIds
  );

  return (
    <Flex height="100%">
      <Flex flexDirection="column" background="palette.gray_lightest">
        <Heading variant="sidebar">Quality Measures Report</Heading>
        {navList}
      </Flex>
      <Button>Toggle</Button>
    </Flex>
  );
};
