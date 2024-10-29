import { Box, Button, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Page } from "./Page";
import { Sidebar } from "./Sidebar";
import { ReportModal } from "./ReportModal";
import { getReport } from "utils/api/requestMethods/report";
import { useParams } from "react-router-dom";
import { useStore } from "utils";
import { FormProvider, useForm } from "react-hook-form";
import { FormPageTemplate } from "types/report";

export const ReportPageWrapper = () => {
  const praStatement =
    "Under the Privacy Act of 1974 any personally identifying information obtained will be kept private to the extent of the law. According to the Paperwork Reduction Act of 1995, no persons are required to respond to a collection of information unless it displays a valid OMB control number. The valid OMB control number for this information collection is 0938-1053. The time required to complete this information collection is estimated to average 2.5 hours per response, including the time to review instructions, search existing data resources, gather the data needed, and complete and review the information collection. If you have comments concerning the accuracy of the time estimate(s) or suggestions for improving this form, please write to: CMS, 7500 Security Boulevard, Attn: PRA Reports Clearance Officer, Mail Stop C4-26-05, Baltimore, Maryland 21244-1850";
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
              {parentPage.index == 0 && <Divider></Divider>}
              <Flex width="100%">
                {parentPage.index > 0 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index - 1)}
                    variant="outline"
                  >
                    Previous
                  </Button>
                )}
                {parentPage.index < parentPage.childPageIds.length - 1 &&
                  parentPage.index !== 0 && (
                    <Button
                      onClick={() => SetPageIndex(parentPage.index + 1)}
                      marginLeft="auto"
                    >
                      Continue
                    </Button>
                  )}
                {parentPage.index == 0 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index + 1)}
                    marginLeft="auto"
                    justifyContent={"flex-end"}
                  >
                    Continue
                  </Button>
                )}
              </Flex>
              <Box flex="auto" width="97.5%">
                {parentPage.index == 0 && (
                  <>
                    <h4>
                      <b>PRA Disclosure Statement</b>
                    </h4>
                    <p>{praStatement}</p>
                  </>
                )}
              </Box>
            </>
          )}
        </VStack>
        <ReportModal />
      </HStack>
    </FormProvider>
  );
};
