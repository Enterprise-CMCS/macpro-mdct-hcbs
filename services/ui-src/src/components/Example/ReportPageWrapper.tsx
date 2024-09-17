import {
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";
import { ReportModal } from "./ReportModal";
import { PageId, PageType } from "./types";
import { getReport } from "utils/api/requestMethods/report";
import { useParams } from "react-router-dom";
import { useStore } from "utils";

export const ReportPageWrapper = () => {
  const { report, pageMap, parentPage, setReport, setParentPage } = useStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalId, setModalId] = useState<string>();
  const { reportType, state, reportId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if (!reportType || !state || !reportId) {
    return <div>bad params</div>; // TODO: error page
  }
  const fetchReport = async () => {
    try {
      const result = await getReport(reportType, state, reportId);

      setReport(result);
      setIsLoading(false);
    } catch {
      // console.log("oopsy");
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (isLoading || !report || !parentPage || !pageMap) {
    return <p>Loading</p>;
  }

  const currentPageId = parentPage.childPageIds[parentPage.index];
  const currentPage = pageMap.get(currentPageId)!;

  const SetPageIndex = (newPageIndex: number) => {
    const childPageCount = parentPage.childPageIds?.length ?? 0;
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
          childPageIds: findParentPage.childPageIds!,
          index: pageIndex,
        });
      }
    }
  };

  return (
    <HStack marginLeft="-30px" height="100%">
      {currentPage.sidebar && <Sidebar setPage={SetPage}></Sidebar>}
      <VStack height="100%" padding="2rem" width="640px">
        <Box flex="auto" alignItems="flex-start" width="100%">
          {currentPage.elements && (
            <Page
              elements={currentPage.elements ?? []}
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
          {parentPage.index < parentPage.childPageIds.length - 1 && (
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
