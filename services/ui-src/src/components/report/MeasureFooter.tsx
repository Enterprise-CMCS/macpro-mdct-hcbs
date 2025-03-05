import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import { MeasureFooterTemplate, MeasurePageTemplate } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "utils";
import { MeasureClearModal } from "./MeasureClearModal";

const onCompleteMeasure = () => {};

const onCompleteSection = () => {};

export const MeasureFooterElement = (props: PageElementProps) => {
  const footer = props.element as MeasureFooterTemplate;
  const isFormValid = false;
  const { reportType, state, reportId } = useParams();
  const {
    currentPageId,
    report,
    pageMap,
    resetMeasure,
    setModalComponent,
    setModalOpen,
  } = useStore();

  if (!report || !pageMap || !currentPageId) return null;
  const measure = report.pages[
    pageMap.get(currentPageId)!
  ] as MeasurePageTemplate;
  const navigate = useNavigate();

  const onClear = () => {
    // Open Modal
    const modal = MeasureClearModal(
      measure,
      () => setModalOpen(false), // Close Action
      resetMeasure // Submit
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
            <Button variant="link" marginRight="2rem" onClick={() => onClear()}>
              Clear measure data
            </Button>
          )}
          {footer.completeMeasure && (
            <Button onClick={() => onCompleteMeasure()} disabled={!isFormValid}>
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
