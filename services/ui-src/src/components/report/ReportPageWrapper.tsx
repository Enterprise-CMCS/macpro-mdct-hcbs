import { useParams } from "react-router-dom";
import { Box, Button, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";
import { ReportModal } from "./ReportModal";
import { SubnavBar } from "./SubnavBar";
import { getReport } from "utils/api/requestMethods/report";
import { useStore } from "utils";
import { FormProvider, useForm } from "react-hook-form";
import { FormPageTemplate } from "types/report";
import { PraDisclosure } from "./PraDisclosure";

export const ReportPageWrapper = () => {
  const {
    report,
    pageMap,
    parentPage,
    currentPageId,
    setReport,
    setAnswers,
    setCurrentPageId,
  } = useStore();
  const { reportType, state, reportId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const methods = useForm({
    defaultValues: useMemo(() => {
      const pageIndex = pageMap?.get(currentPageId ?? "")!;
      return report?.pages[pageIndex];
    }, [currentPageId]) as FormPageTemplate,
    shouldUnregister: true,
  });

  const { handleSubmit, reset } = methods;
  useEffect(() => {
    const pageIndex = pageMap?.get(currentPageId ?? "")!;
    reset(report?.pages[pageIndex]);
  }, [currentPageId]);

  const handleBlur = (data: any) => {
    if (!report) return;
    setAnswers(data);
  };

  const fetchReport = async () => {
    if (!reportType || !state || !reportId) return;
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

  if (!reportType || !state || !reportId) {
    return <div>bad params</div>; // TODO: error page
  }

  if (isLoading || !report || !pageMap || !currentPageId) {
    return <p>Loading</p>;
  }

  const currentPage = report.pages[pageMap.get(currentPageId)!];
  const SetPageIndex = (newPageIndex: number) => {
    if (!parentPage) return; // Pages can exist outside of the direct parentage structure
    setCurrentPageId(parentPage.childPageIds[newPageIndex]);
  };

  return (
    <FormProvider {...methods}>
      <SubnavBar />
      <HStack width="100%" height="100%" position="relative" spacing="0">
        {currentPage.sidebar && <Sidebar />}
        <VStack
          height="100%"
          padding={{ base: "4rem 1rem", md: "4rem 2rem 2rem 2rem" }}
          width="100%"
          maxWidth="reportPageWidth"
          gap="1rem"
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
              {/* TO-DO: solidify the Divider behavior for our form controls vs elements in a page 
             i.e, when table appears as the last element on a form page */}
              <Divider></Divider>
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
              <Box flex="auto">
                {parentPage.index == 0 && <PraDisclosure />}
              </Box>
            </>
          )}
        </VStack>
        <ReportModal />
      </HStack>
    </FormProvider>
  );
};
