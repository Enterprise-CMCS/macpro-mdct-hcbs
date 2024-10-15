import { Box, Button, Heading, Flex, Image } from "@chakra-ui/react";
import { useStore } from "utils";
import { AnyObject } from "yup/lib/types";
import { ParentPageTemplate } from "../../types/report";
import arrowDownIcon from "assets/icons/arrows/icon_arrow_down_gray.svg";
import arrowUpIcon from "assets/icons/arrows/icon_arrow_up_gray.svg";

const navItemText = (title: string, index: number) => {
  if (index <= 0) return title;
  return <Box paddingLeft="1rem">{navItemText(title, index - 1)}</Box>;
};

const navItem = (
  page: AnyObject,
  index: number,
  toggle: AnyObject,
  func: Function
) => {
  return (
    <Button variant="sidebar" key={page.id}>
      <Flex justifyContent="space-between" alignItems="center">
        <Box onClick={() => func(page.id)} width="100%" height="100%">
          {navItemText(page.title!, index)}
        </Box>
        <Box onClick={() => toggle.func()}>
          {toggle && (
            <Image
              src={toggle.state ? arrowDownIcon : arrowUpIcon}
              alt={toggle.state ? "Arrow left" : "Arrow right"}
            />
          )}
        </Box>
      </Flex>
    </Button>
  );
};

const toggleMap: any = {};

export const Sidebar = () => {
  const { report, pageMap, setCurrentPageId } = useStore();

  if (!report || !pageMap) {
    return null;
  }

  const setToggle = (page: ParentPageTemplate) => {
    toggleMap[page.id] = !toggleMap[page.id];
  };

  const buildNavList = (
    pageIds: string[],
    layer: number = 0
  ): JSX.Element[] => {
    const builtList = [];
    for (const child of pageIds) {
      const page = pageMap.get(child) as ParentPageTemplate;
      const toggleData = page.childPageIds && {
        state: toggleMap[page.id],
        func: () => setToggle(page),
      };
      builtList.push(navItem(page, layer, toggleData, setCurrentPageId));
      const toggle = toggleMap[page.id];
      if (page.childPageIds && toggle!) {
        builtList.push(buildNavList(page.childPageIds, layer + 1));
      }
    }
    return builtList as JSX.Element[];
  };

  return (
    <Flex height="100%">
      <Flex flexDirection="column" background="palette.gray_lightest">
        <Heading variant="sidebar">Quality Measures Report</Heading>
        {buildNavList((pageMap.get("root") as ParentPageTemplate).childPageIds)}
      </Flex>
      <Button>Toggle</Button>
    </Flex>
  );
};
