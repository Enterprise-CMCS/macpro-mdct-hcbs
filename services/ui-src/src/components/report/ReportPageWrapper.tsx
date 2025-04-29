import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  VStack,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { getReport, useStore } from "utils";
import { ReportModal, Sidebar, Page, PraDisclosure } from "components";
import { yupResolver } from "@hookform/resolvers/yup";
import { elementsValidateSchema } from "utils/validation/reportValidation";
import { currentPageSelector } from "utils/state/selectors";

import nextArrowIcon from "assets/icons/arrows/icon_arrow_next_white.svg";
import prevArrowIcon from "assets/icons/arrows/icon_arrow_prev_primary.svg";
import { isReviewSubmitPage, ReportStatus } from "types";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";

export const ReportPageWrapper = () => {
  const {
    report,
    pageMap,
    parentPage,
    loadReport: setReport,
    setAnswers,
    setCurrentPageId,
  } = useStore();
  const currentPage = useStore(currentPageSelector);

  const { reportType, state, reportId, pageId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { autosave } = useContext(ReportAutosaveContext);

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

  const handleChange = async (data: any) => {
    setAnswers(data);
    autosave();
  };

  const handleError = async (errors: any) => {
    const data = methods.getValues();
    if (!report) return;
    setAnswers(data, errors);
    autosave();
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
    return (
      <Flex sx={sx.spinnerContainer}>
        <Spinner size="md" />
      </Flex>
    );
  }

  const SetPageIndex = (newPageIndex: number) => {
    if (!parentPage) return; // Pages can exist outside of the direct parentage structure
    const sectionId = parentPage.childPageIds[newPageIndex];
    navigate(`/report/${reportType}/${state}/${reportId}/${sectionId}`);
  };

  const submittedView =
    isReviewSubmitPage(currentPage) &&
    report?.status === ReportStatus.SUBMITTED;
  const renderedElements = submittedView
    ? currentPage.submittedView
    : currentPage.elements;
  return (
    <FormProvider {...methods}>
      <HStack width="100%" height="100%" position="relative" spacing="0">
        {currentPage.sidebar && <Sidebar />}
        <VStack
          height="100%"
          padding={
            currentPage.sidebar
              ? { base: "3.5rem 1rem", md: "3.5rem 0rem" }
              : { base: "2rem 1rem", md: "2rem 0rem" }
          }
          margin={currentPage.sidebar ? { md: "0 4rem" } : { md: "0 6rem" }}
          width="100%"
          maxWidth={currentPage.sidebar ? "reportPageWidth" : "fullPageWidth"}
          gap="0rem"
        >
          <Box flex="auto" alignItems="flex-start" width="100%">
            <form
              id="aFormId"
              autoComplete="off"
              onChange={handleSubmit(handleChange, handleError)}
            >
              {currentPage.elements && (
                <Page elements={renderedElements ?? []}></Page>
              )}
            </form>
          </Box>
          {!currentPage.hideNavButtons && parentPage && (
            <>
              {parentPage.index == 0 && <Divider></Divider>}
              <Flex width="100%" margin="1.5rem 0 0 0">
                {parentPage.index > 0 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index - 1)}
                    variant="outline"
                    leftIcon={<Image src={prevArrowIcon} />}
                  >
                    Previous
                  </Button>
                )}
                {parentPage.index < parentPage.childPageIds.length - 1 && (
                  <Button
                    onClick={() => SetPageIndex(parentPage.index + 1)}
                    marginLeft="auto"
                    rightIcon={<Image src={nextArrowIcon} />}
                  >
                    Continue
                  </Button>
                )}
              </Flex>
              {parentPage.index == 0 && (
                <Box flex="auto" marginTop="3.5rem">
                  <PraDisclosure />
                </Box>
              )}
            </>
          )}
        </VStack>
        <ReportModal />
      </HStack>
    </FormProvider>
  );
};

const sx = {
  spinnerContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    padding: "10",
  },
};
