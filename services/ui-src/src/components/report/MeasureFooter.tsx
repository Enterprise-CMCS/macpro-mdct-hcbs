import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import { MeasureFooterTemplate } from "types";
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

  if (!currentPage) return null;
  const navigate = useNavigate();
  const submitClear = () => {
    resetMeasure(currentPage.id);
    saveReport();
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
