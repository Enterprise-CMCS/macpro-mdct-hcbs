import { Box, Button, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import {
  isFormPageTemplate,
  MeasureFooterTemplate,
  PageStatus,
  ReportStatus,
} from "types";
import { useNavigate, useParams } from "react-router-dom";
import { measurePrevPage, useStore } from "utils";
import { MeasureClearModal } from "./MeasureClearModal";
import {
  currentPageCompletableSelector,
  currentPageSelector,
} from "utils/state/selectors";
import { useContext } from "react";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";

export const MeasureFooterElement = (
  props: PageElementProps<MeasureFooterTemplate>
) => {
  const footer = props.element;
  const { reportType, state, reportId } = useParams();
  const {
    report,
    resetMeasure,
    setModalComponent,
    setModalOpen,
    completePage,
  } = useStore();
  const { autosave } = useContext(ReportAutosaveContext);
  const { userIsEndUser } = useStore().user ?? {};
  const readOnlyView =
    !userIsEndUser || report?.status === ReportStatus.SUBMITTED;
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
    // Reset zustand state
    resetMeasure(currentPage.id);
    autosave();
  };

  const getPrevPageId = () => {
    //if a measure parent, search for the id, else use the one being passed in
    return footer.completeMeasure
      ? measurePrevPage(report!, currentPage.id)
      : footer.prevTo;
  };

  const onCompletePage = () => {
    completePage(currentPage.id);
    autosave();

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
          {footer.clear && !readOnlyView && (
            <Button
              variant="link"
              marginRight="2rem"
              onClick={() => onClearButton()}
            >
              Clear measure data
            </Button>
          )}
          {footer.completeMeasure && (
            <Button
              disabled={!completeEnabled}
              onClick={() => onCompletePage()}
            >
              Complete measure
            </Button>
          )}
          {footer.completeSection && (
            <Button
              disabled={!completeEnabled}
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
