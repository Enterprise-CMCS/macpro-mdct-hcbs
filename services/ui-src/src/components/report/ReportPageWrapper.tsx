import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Button, Divider, Flex, HStack, VStack } from "@chakra-ui/react";
import { getReport, useStore } from "utils";
import {
  ReportModal,
  Sidebar,
  SubnavBar,
  Page,
  PraDisclosure,
} from "components";
import { yupResolver } from "@hookform/resolvers/yup";
import { elementsValidateSchema } from "utils/validation/reportValidation";
import { currentPageSelector } from "utils/state/selectors";

export const ReportPageWrapper = () => {
  const {
    report,
    pageMap,
    parentPage,
    setReport,
    setAnswers,
    setCurrentPageId,
    saveReport,
  } = useStore();
  const currentPage = useStore(currentPageSelector);

  const { reportType, state, reportId, pageId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const methods = useForm({
    defaultValues: {},
    shouldUnregister: true,
    resolver: yupResolver(elementsValidateSchema),
  });

  const navigate = useNavigate();

  const { handleSubmit, reset } = methods;
  useEffect(() => {
    const pageIndex = pageMap?.get(pageId ?? "")!;
    reset(report?.pages[pageIndex]);
    if (pageId) {
      setCurrentPageId(pageId);
    }
  }, [pageId]);

  const handleBlur = async (data: any) => {
    if (!report) return;
    setAnswers(data);
    saveReport();
  };

  const handleError = async (errors: any) => {
    const data = methods.getValues();
    if (!report) return;
    setAnswers(data, errors);
    saveReport();
  };

  const fetchReport = async () => {
    if (!reportType || !state || !reportId) return;
    try {
      const result = await getReport(reportType, state, reportId);
      setReport(result);
      if (pageId) {
        setCurrentPageId(pageId);
      }
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

  if (isLoading || !currentPage) {
    return <p>Loading</p>;
  }

  const SetPageIndex = (newPageIndex: number) => {
    if (!parentPage) return; // Pages can exist outside of the direct parentage structure
    const sectionId = parentPage.childPageIds[newPageIndex];
    navigate(`/report/${reportType}/${state}/${reportId}/${sectionId}`);
  };

  return (
    <FormProvider {...methods}>
      <SubnavBar />
      <HStack width="100%" height="100%" position="relative" spacing="0">
        {currentPage.sidebar && <Sidebar />}
        <VStack
          height="100%"
          padding={{ base: "4rem 1rem", md: "4rem 4rem 4rem 4rem" }}
          width="100%"
          maxWidth="reportPageWidth"
          gap="1rem"
        >
          <Box flex="auto" alignItems="flex-start" width="100%">
            <form
              id="aFormId"
              autoComplete="off"
              onBlur={handleSubmit(handleBlur, handleError)}
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
