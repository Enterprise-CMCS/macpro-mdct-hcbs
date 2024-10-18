import { Box, Button, Heading, Stack, VStack } from "@chakra-ui/react";
import { useStore } from "utils";
import { AnyObject } from "yup/lib/types";
import { ParentPageTemplate } from "../../types/report";

export const navItem = (page: AnyObject, func: Function) => {
  return (
    <Button key={page.id} variant="sidebar" onClick={() => func(page.id)}>
      {page.title}
    </Button>
  );
};

export const Sidebar = () => {
  const { report, pageMap, setCurrentPageId } = useStore();

  if (!report || !pageMap) {
    return null;
  }
  const root = pageMap.get("root");
  if (root == undefined) throw new Error("Sidebar missing root object.");

  const buildNavList = (childPageIds: string[]) => {
    const builtList: any[] = [];

    for (const child of childPageIds) {
      const pageIndex = pageMap.get(child);
      if (pageIndex == undefined) continue; // how did you do this
      const page = report.pages[pageIndex];
      if (page.childPageIds) {
        builtList.push(
          <Stack key={page.id} width="100%" spacing="0">
            {navItem(page, setCurrentPageId)}
            <Box>{buildNavList(page.childPageIds)}</Box>
          </Stack>
        );
      } else {
        builtList.push(navItem(page, setCurrentPageId));
      }
    }
    return builtList;
  };
  const navList = buildNavList(
    (report.pages[root] as ParentPageTemplate).childPageIds
  );
  return (
    <VStack height="100%" width="320px" background="gray.100" spacing="0">
      <Heading fontSize="21" fontWeight="700" padding="32px">
        Quality Measures Report
      </Heading>
      {navList}
    </VStack>
  );
};
