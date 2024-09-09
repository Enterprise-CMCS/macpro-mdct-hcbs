import { Box, Button, Container, Divider, Heading, HStack, Stack, VStack } from "@chakra-ui/react";
import { testJson } from "./json/layer-test";
import { useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";

interface PageData {
  parent: string;
  children: string[];
  index: number;
}

export const ReportPageWrapper = () => {
  const pageMap = new Map();
  for (const parentPage of testJson.pages) {
    pageMap.set(parentPage.id, parentPage);
  }

  const [parentPage, setParentPage] = useState<PageData>({
    parent: pageMap.get("root").id,
    children: pageMap.get("root").children,
    index: 0,
  });

  const SetPageIndex = (newPageIndex: number) => {
    if (newPageIndex >= 0 && newPageIndex < parentPage?.children.length) {
      setParentPage({ ...parentPage, index: newPageIndex });
    }
  };

  const SetPage = (pageTo: any) => {
    const findParentPage = [...pageMap.values()].find((parentPage) =>
      parentPage?.children?.includes(pageTo)
    );
    if (findParentPage) {
      const pageIndex = (findParentPage.children as string[]).findIndex(
        (key) => key === pageTo
      );
      setParentPage({
        parent: findParentPage.id,
        children: findParentPage.children,
        index: pageIndex,
      });
    }
  };

  const PrevPageName = (name: string) => {
    return pageMap.get(name).id;
  };

  const currPage = () => {
    const currPage = parentPage.children[parentPage.index];
    return pageMap.get(currPage);
  };

  return (
    <HStack marginLeft="-30px" height="100%">
      <Sidebar></Sidebar>
      {parentPage.parent && parentPage.parent != "root" && (
        <Button
          onClick={() => SetPage(parentPage.parent)}
          position="absolute"
          ml="40"
          mt="6"
        >
          Return to {PrevPageName(parentPage.parent)}
        </Button>
      )}
      <VStack height="100%" padding="2rem" width="640px">
        <Box flex="auto" alignItems="flex-start" width="100%">
          {currPage().elements && (
            <Page elements={currPage().elements} setPage={SetPage}></Page>
          )}
        </Box>
        <Divider></Divider>
        <Stack direction="row" width="100%">
          {parentPage.index > 0 && (
            <Button onClick={() => SetPageIndex(parentPage.index - 1)} mr="3">
              Previous
            </Button>
          )}
          {parentPage.index < parentPage.children.length - 1 && (
            <Button onClick={() => SetPageIndex(parentPage.index + 1)} alignSelf="flex-end">
              Continue
            </Button>
          )}
        </Stack>
      </VStack>
    </HStack>
  );
};
