import { Box, Button, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import { isFormPageTemplate, MeasureFooterTemplate, PageStatus } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { measurePrevPage, useStore } from "utils";
import { MeasureClearModal } from "./MeasureClearModal";
import {
  currentPageCompletableSelector,
  currentPageSelector,
} from "utils/state/selectors";

export const MeasureFooterElement = (props: PageElementProps) => {
  const footer = props.element as MeasureFooterTemplate;
  const { reportType, state, reportId } = useParams();
  const {
    report,
    resetMeasure,
    saveReport,
    setModalComponent,
    setModalOpen,
    completePage,
  } = useStore();
  const currentPage = useStore(currentPageSelector);
  const completable = useStore(currentPageCompletableSelector);
  const completeEnabled =
    completable &&
    currentPage &&
    isFormPageTemplate(currentPage) &&
    currentPage.status !== PageStatus.COMPLETE;
  if (!currentPage) return null;
  const navigate = useNavigate();
  const submitClear = () => {
    resetMeasure(currentPage.id);
    saveReport();
  };

  const getPrevPageId = () => {
    //if a measure parent, search for the id, else use the one being passed in
    return footer.completeMeasure
      ? measurePrevPage(report!, currentPage.id)
      : footer.prevTo;
  };

  const onCompletePage = () => {
    completePage(currentPage.id);
    saveReport();

    //there's some interference with the scroll so we need a delay before it will work
    setTimeout(function () {
      window.scrollTo(0, 0);
    }, 5);
  };

  const onClearButton = () => {
    // Open Modal
    const modal = MeasureClearModal(
      currentPage.id,
      () => setModalOpen(false), // Close Action
      submitClear // Submit
    ); // This will need the whole measure eventually
    setModalComponent(
      modal,
      "Are you sure you want to clear the measure data?"
    );
  };

  return (
    <Box width="100%" marginTop="4">
      <Flex justifyContent="space-between">
        <Button
          variant="outline"
          onClick={() =>
            navigate(
              `/report/${reportType}/${state}/${reportId}/${getPrevPageId()}`
            )
          }
        >
          Previous
        </Button>
        {footer.nextTo && (
          <Button
            onClick={() =>
              navigate(
                `/report/${reportType}/${state}/${reportId}/${footer.nextTo}`
              )
            }
          >
            Next
          </Button>
        )}

        <Box>
          {footer.clear && (
            <Button
              variant="link"
              marginRight="2rem"
              onBlur={(event) => {
                event.stopPropagation();
              }}
              onClick={() => onClearButton()}
            >
              Clear measure data
            </Button>
          )}
          {footer.completeMeasure && (
            <Button
              disabled={!completeEnabled}
              onBlur={(event) => {
                event.stopPropagation();
              }}
              onClick={() => onCompletePage()}
            >
              Complete measure
            </Button>
          )}
          {footer.completeSection && (
            <Button
              disabled={!completeEnabled}
              onBlur={(event) => {
                event.stopPropagation();
              }}
              onClick={() => onCompletePage()}
            >
              Complete section
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
