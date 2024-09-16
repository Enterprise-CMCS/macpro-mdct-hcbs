import {
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { hcbsReportTemplate } from "./templates/hcbs";
import { useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";
import { ReportModal } from "./ReportModal";
import { PageId, PageTemplate, PageType, ParentPageTemplate } from "./types";

interface PageData {
  parent: string;
  children: string[];
  index: number;
}

export const ReportPageWrapper = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalId, setModalId] = useState<string>();

  const pageMap = new Map<string, PageTemplate>();
  for (const parentPage of hcbsReportTemplate.pages) {
    pageMap.set(parentPage.id, parentPage);
  }

  const rootPage = pageMap.get("root") as ParentPageTemplate; // this cast is safe, per unit tests
  const [parentPage, setParentPage] = useState<PageData>({
    parent: rootPage.id,
    children: rootPage.childPageIds,
    index: 0,
  });

  const SetPageIndex = (newPageIndex: number) => {
    const childPageCount = parentPage.children?.length ?? 0;
    if (newPageIndex >= 0 && newPageIndex < childPageCount) {
      setParentPage({ ...parentPage, index: newPageIndex });
    }
  };

  const SetPage = (pageTo: PageId, type?: PageType) => {
    if (type === PageType.Modal) {
      setModalId(pageTo);
      onOpen();
    } else {
      const findParentPage = [...pageMap.values()].find((parentPage) =>
        parentPage?.childPageIds?.includes(pageTo)
      );
      if (findParentPage) {
        // @ts-ignore TODO
        const pageIndex = findParentPage.childPageIds.findIndex(
          (pageId) => pageId === pageTo
        );
        setParentPage({
          parent: findParentPage.id,
          children: findParentPage.childPageIds!,
          index: pageIndex,
        });
      }
    }
  };

  const currentPage = () => {
    const currentPageId = parentPage.children[parentPage.index];
    return pageMap.get(currentPageId)!;
  };

  return (
    <HStack marginLeft="-30px" height="100%">
      {currentPage().sidebar && <Sidebar setPage={SetPage}></Sidebar>}
      <VStack height="100%" padding="2rem" width="640px">
        <Box flex="auto" alignItems="flex-start" width="100%">
          {currentPage().elements && (
            <Page
              elements={currentPage().elements ?? []}
              setPage={SetPage}
            ></Page>
          )}
        </Box>
        <Divider></Divider>
        <Stack
          direction="row"
          width="100%"
          display="flex"
          justifyContent="space-between"
        >
          {
            <Button
              onClick={() => SetPageIndex(parentPage.index - 1)}
              mr="3"
              display={parentPage.index > 0 ? "block" : "contents"}
            >
              Previous
            </Button>
          }
          {parentPage.index < parentPage.children.length - 1 && (
            <Button
              onClick={() => SetPageIndex(parentPage.index + 1)}
              alignSelf="flex-end"
            >
              Continue
            </Button>
          )}
        </Stack>
      </VStack>
      <ReportModal
        elements={pageMap?.get(modalId ?? "")?.elements ?? []}
        isOpen={isOpen}
        onClose={onClose}
      ></ReportModal>
    </HStack>
  );
};
