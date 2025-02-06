import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "../report/Elements";
import { MeasureFooterTemplate } from "types";
import { useNavigate, useParams } from "react-router-dom";

const onCompleteMeasure = () => {};

const onCompleteSection = () => {};

const onClear = () => {};

export const MeasureFooterElement = (props: PageElementProps) => {
  const footer = props.element as MeasureFooterTemplate;
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

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
            <Button disabled={true} onClick={() => onCompleteMeasure()}>
              Complete measure
            </Button>
          )}
          {footer.completeSection && (
            <Button disabled={true} onClick={() => onCompleteSection()}>
              Complete section
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
