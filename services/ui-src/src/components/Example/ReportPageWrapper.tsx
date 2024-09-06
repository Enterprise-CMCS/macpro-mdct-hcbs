import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react";
import { testJson } from "./json/layer-test";
import { useState } from "react";
import { AnyObject } from "yup/lib/types";
import { Page } from "./Page";

interface PageData {
  pageList: AnyObject;
  index: number;
}

export const ReportPageWrapper = () => {
  const [prevPages, setPrevPages] = useState<PageData[]>([]);
  const [page, setPage] = useState<PageData>({
    pageList: testJson.pages,
    index: 0,
  });

  const SetPageIndex = (newPageIndex: number) => {
    if (newPageIndex >= 0 && newPageIndex < page?.pageList.length) {
      setPage({ ...page, index: newPageIndex });
    }
  };

  const SetPageFunction = (pages: any) => {
    const prevPageList = prevPages.concat(page);
    setPrevPages(prevPageList);
    setPage({ pageList: pages, index: 0 });
  };

  const ReturnToLastPage = () => {
    const lastPage = prevPages.pop();
    setPrevPages(prevPages);
    if (lastPage) {
      setPage(lastPage);
    }
  };

  const PrevPageName = () => {
    const lastPage = prevPages[prevPages.length - 1];
    return lastPage?.pageList[lastPage.index].name ?? "";
  };

  const currPage = () => {
    return page.pageList[page.index];
  };

  return (
    <>
      {prevPages.length > 0 && (
        <Button onClick={() => ReturnToLastPage()} position="absolute" mt="6">
          Return to {PrevPageName()}
        </Button>
      )}
      <VStack height="100%" padding="2rem">
        <Box flex="auto">
          <Heading textTransform="uppercase">{currPage().name}</Heading>
          {currPage().elements && (
            <Page
              elements={currPage().elements}
              setPage={SetPageFunction}
            ></Page>
          )}
        </Box>
        <Container display="flex" justifyContent="flex-end" padding="0">
          {page.index > 0 && (
            <Button onClick={() => SetPageIndex(page.index - 1)} mr="3">
              Previous
            </Button>
          )}
          {page.index < page.pageList.length - 1 && (
            <Button onClick={() => SetPageIndex(page.index + 1)}>Next</Button>
          )}
        </Container>
      </VStack>
    </>
  );
};
