import {
  Box,
  Button,
  Heading,
  Stack,
  Flex,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useStore } from "utils";
import { AnyObject } from "yup/lib/types";
import { ParentPageTemplate } from "../../types/report";
import { useState } from "react";

const navItem = (page: AnyObject, index: number, func: Function) => {
  const [section, setSection] = useState<boolean>(false);
  return (
    <Button variant="sidebar" key={page.id} onClick={() => func(page.id)}>
      <Flex justifyContent="space-between" alignItems="center">
        {navItemText(page.title!, index)}
        {index > 0 && <Button variant="sidebarToggle">toggle</Button>}
      </Flex>
    </Button>
  );
};

const navItemText = (title: string, index: number) => {
  if (index <= 0) return title;
  return (
    <UnorderedList variant="sidebar">
      <ListItem>{navItemText(title, index - 1)}</ListItem>
    </UnorderedList>
  );
};

export const Sidebar = () => {
  const { report, pageMap, setCurrentPageId } = useStore();
  // const [selectedNav, setSelectedNav ] = useState<string>();

  if (!report || !pageMap) {
    return null;
  }
  const buildNavList = (pageIds: string[], layer: number = 0) => {
    const builtList = [];
    for (const child of pageIds) {
      const page = pageMap.get(child) as ParentPageTemplate;
      builtList.push(navItem(page, layer, setCurrentPageId));
      if (page.childPageIds) {
        builtList.push(buildNavList(page.childPageIds, layer + 1));
      }
    }
    return builtList;
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