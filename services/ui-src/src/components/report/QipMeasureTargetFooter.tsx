import { Box, Button, Divider, Flex } from "@chakra-ui/react";
import { PageElementProps } from "./Elements";
import { QipMeasureTargetFooterTemplate, ReportStatus } from "types";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "utils";
import { currentPageSelector } from "utils/state/selectors";
import { useContext } from "react";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";
import { displayDivider } from "utils/state/reportLogic/reportActions";

export const QipMeasureTargetFooterElement = (
  props: PageElementProps<QipMeasureTargetFooterTemplate>
) => {
  const { element: footer } = props;
  const { reportType, state, reportId } = useParams();
  const { report } = useStore();
  const { autosave } = useContext(ReportAutosaveContext);
  const { userIsEndUser } = useStore().user ?? {};
  const readOnly = !userIsEndUser || report?.status === ReportStatus.SUBMITTED;
  const currentPage = useStore(currentPageSelector);
  const navigate = useNavigate();

  if (!currentPage) return null;

  const onActionButton = () => {
    if (!readOnly) {
      autosave();
    }

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
        <Button onClick={() => onActionButton()}>Save &amp; return</Button>
      </Flex>
    </Box>
  );
};
