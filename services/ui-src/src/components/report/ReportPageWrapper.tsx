import { Box, Button, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";
import { ReportModal } from "./ReportModal";
import { getReport } from "utils/api/requestMethods/report";
import { useParams } from "react-router-dom";
import { useStore } from "utils";
import { FormProvider, useForm } from "react-hook-form";

export const ReportPageWrapper = () => {
  const {
    report,
    pageMap,
    parentPage,
    currentPageId,
    setReport,
    setParentPage,
    setCurrentPageId,
  } = useStore();
  const { reportType, state, reportId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const methods = useForm({
    shouldUnregister: true,
  });

  const { handleSubmit } = methods;
  const handleBlur = (data: any) => {
    // TODO: any
    if (!report) return;
    // console.log(methods.formState);
    report.answers = [...data.answers];
    // TODO: Post
  };

  if (!reportType || !state || !reportId) {
    return <div>bad params</div>; // TODO: error page
  }
  const fetchReport = async () => {
    try {
      const result = await getReport(reportType, state, reportId);
      setReport(result);
      setIsLoading(false);
    } catch {
      // console.log("oopsy")
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (isLoading || !report || !pageMap || !currentPageId) {
    return <p>Loading</p>;
  }

  // I'm pretty sure these can all be moved into the state, but have not used the brainpower
  const currentPage = pageMap.get(currentPageId)!;
  const SetPageIndex = (newPageIndex: number) => {
    if (!parentPage) return; // Pages can exist outside of the direct parentage structure
    const childPageCount = parentPage.childPageIds?.length ?? 0;

    if (newPageIndex >= 0 && newPageIndex < childPageCount) {
      setParentPage({ ...parentPage, index: newPageIndex });
      setCurrentPageId(parentPage.childPageIds[newPageIndex]);
    }
  };

  return (
    <FormProvider {...methods}>
      <HStack width="100%" height="100%" position="relative" spacing="0">
        {currentPage.sidebar && <Sidebar />}
        <VStack
          height="100%"
          padding={{ base: "4rem 1rem", md: "4rem 2rem 2rem 2rem" }}
          width="100%"
          maxWidth="reportPageWidth"
          gap="6"
        >
          <Box flex="auto" alignItems="flex-start" width="100%">
            <form
              id="aFormId"
              autoComplete="off"
              onBlur={handleSubmit(handleBlur)}
            >
              {currentPage.elements && (
                <Page elements={currentPage.elements ?? []}></Page>
              )}
            </form>
          </Box>
          {!currentPage.hideNavButtons && parentPage && (
            <>
              <Divider borderColor="palette.gray_light"></Divider>
              <Flex width="100%">
                {parentPage.index > 0 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index - 1)}
                    variant="outline"
                  >
                    Previous
                  </Button>
                )}
                {parentPage.index < parentPage.childPageIds.length - 1 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index + 1)}
                    marginLeft="auto"
                  >
                    Continue
                  </Button>
                )}
              </Flex>
            </>
          )}
        </VStack>
        <ReportModal />
      </HStack>
    </FormProvider>
  );
};
