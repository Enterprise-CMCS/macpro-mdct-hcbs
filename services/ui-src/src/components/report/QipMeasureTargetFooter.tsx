import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "./Elements";
import { QipMeasureTargetFooterTemplate } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "utils";
import { currentPageSelector } from "utils/state/selectors";
import { useContext } from "react";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";
import { displayDivider } from "utils/state/reportLogic/reportActions";

export const QipMeasureTargetFooterElement = (
  props: PageElementProps<QipMeasureTargetFooterTemplate>
) => {
  const footer = props.element;
  const { reportType, state, reportId } = useParams();
  const { autosave } = useContext(ReportAutosaveContext);
  const currentPage = useStore(currentPageSelector);
  const navigate = useNavigate();

  if (!currentPage) return null;

  const onActionButton = () => {
    autosave();

    // following pattern in MeasureFooter for scroll timing
    setTimeout(function () {
      navigate(`/report/${reportType}/${state}/${reportId}/${footer.returnTo}`);
    }, 5);
  };

  return (
    <Box width="100%" marginTop="spacer3">
      {displayDivider(currentPage) && (
        <Divider marginBottom="spacer3"></Divider>
      )}
      <Flex justifyContent="flex-end">
        <Button onClick={() => onActionButton()}>Save & return</Button>
      </Flex>
    </Box>
  );
};
