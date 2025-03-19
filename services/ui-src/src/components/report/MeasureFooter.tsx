import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import { MeasureFooterTemplate, MeasurePageTemplate, PageType } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "utils";
import { MeasureClearModal } from "./MeasureClearModal";
import { currentPageSelector } from "utils/state/selectors";

const onCompleteMeasure = () => {};

const onCompleteSection = () => {};

export const MeasureFooterElement = (props: PageElementProps) => {
  const footer = props.element as MeasureFooterTemplate;
  const { reportType, state, reportId } = useParams();
  const { resetMeasure, saveReport, setModalComponent, setModalOpen } =
    useStore();
  const currentPage = useStore(currentPageSelector);

  if (!currentPage || currentPage.type !== PageType.Measure) return null;
  const measure = currentPage as MeasurePageTemplate;
  const navigate = useNavigate();
  const submitClear = () => {
    resetMeasure(measure.id);
    saveReport();
  };

  const onClearButton = () => {
    // Open Modal
    const modal = MeasureClearModal(
      measure,
      () => setModalOpen(false), // Close Action
      submitClear // Submit
    ); // This will need the whole measure eventually
    setModalComponent(
      modal,
      "Are you sure you want to clear the measure data?"
    );
  };

  return (
    <Box width="100%">
      <Divider marginBottom="2rem" />
      <Flex justifyContent="space-between">
        <Button
          variant="outline"
          onClick={() =>
            navigate(
              `/report/${reportType}/${state}/${reportId}/${footer.prevTo}`
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
              onClick={() => onClearButton()}
            >
              Clear measure data
            </Button>
          )}
          {footer.completeMeasure && (
            <Button onClick={() => onCompleteMeasure()}>
              Complete measure
            </Button>
          )}
          {footer.completeSection && (
            <Button onClick={() => onCompleteSection()}>
              Complete section
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
