import { Box, Button, Divider, HStack, Stack, VStack } from "@chakra-ui/react";
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
    }
  };

  return (
    <FormProvider {...methods}>
      <form id="aFormId" autoComplete="off" onBlur={handleSubmit(handleBlur)}>
        <HStack marginLeft="-30px" height="100%">
          {currentPage.sidebar && <Sidebar />}
          <VStack height="100%" padding="2rem" width="640px">
            <Box flex="auto" alignItems="flex-start" width="100%">
              {currentPage.elements && (
                <Page elements={currentPage.elements ?? []}></Page>
              )}
            </Box>
            <Divider></Divider>
            <Stack
              direction="row"
              width="100%"
              display="flex"
              justifyContent="space-between"
            >
              {parentPage && (
                <Button
                  onClick={() => SetPageIndex(parentPage.index - 1)}
                  mr="3"
                  display={parentPage.index > 0 ? "block" : "contents"}
                >
                  Previous
                </Button>
              )}
              {parentPage &&
                parentPage.index < parentPage.childPageIds.length - 1 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index + 1)}
                    alignSelf="flex-end"
                  >
                    Continue
                  </Button>
                )}
            </Stack>
          </VStack>
          <ReportModal />
        </HStack>
      </form>
    </FormProvider>
  );
};
