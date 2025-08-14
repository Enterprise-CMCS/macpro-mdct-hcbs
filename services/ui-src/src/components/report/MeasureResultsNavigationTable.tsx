import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";
import { useStore } from "utils";
import { TableStatusIcon } from "components/tables/TableStatusIcon";
import {
  MeasurePageTemplate,
  MeasureResultsNavigationTableTemplate,
  PageStatus,
  PageType,
  RadioTemplate,
} from "types";
import { useParams, useNavigate } from "react-router-dom";
import { currentPageSelector, elementSelector } from "utils/state/selectors";
import { useElementIsHidden } from "utils/state/hooks/useElementIsHidden";
import { PageElementProps } from "../report/Elements";

export const MeasureResultsNavigationTableElement = (
  props: PageElementProps<MeasureResultsNavigationTableTemplate>
) => {
  const table = props.element;
  const { reportType, state, reportId } = useParams();
  const { report } = useStore();
  const currentPage = useStore(currentPageSelector);
  const deliveryMethodRadio = useStore(
    elementSelector("delivery-method-radio")
  ) as RadioTemplate;
  const navigate = useNavigate();
  const hideElement = useElementIsHidden(table.hideCondition);

  if (!report || !currentPage || currentPage.type !== PageType.Measure) {
    return null;
  }
  const measurePage = currentPage as MeasurePageTemplate;

  const buildPath = (childPageId: string) => {
    return `/report/${reportType}/${state}/${reportId}/${childPageId}`;
  };

  const getTableStatus = (
    measure: MeasurePageTemplate | undefined,
    disabled: boolean
  ) => {
    if (disabled || !measure) return;
    return measure.status;
  };

  const errorMessage = (measure: MeasurePageTemplate, disabled: boolean) => {
    if (disabled) return;

    //TO DO: add real code
    if (measure?.status !== PageStatus.COMPLETE)
      return <Text variant="error">Select "Edit" to report progress.</Text>;

    return <></>;
  };

  if (hideElement) {
    return null;
  }

  // Note pages like LTSS-5 have 2 child pages, but 1 delivery system.
  const singleOption = measurePage.cmitInfo?.deliverySystem.length == 1;
  // Build Rows
  const rows = measurePage.dependentPages?.map((childLink, index) => {
    const selections = deliveryMethodRadio?.answer ?? "";
    const deliverySystemIsSelected = selections
      .split(",")
      .includes(childLink.key);
    const childPage = report.pages.find(
      (page) => page.id === childLink.template
    ) as MeasurePageTemplate;
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon
            tableStatus={getTableStatus(
              childPage,
              !singleOption && !deliverySystemIsSelected
            )}
          ></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">{childLink.linkText}</Text>
          <Text>CMIT number: #{measurePage.cmit}</Text>
          <Text>
            Status:{" "}
            {!singleOption && !deliverySystemIsSelected
              ? "N/A"
              : childPage?.status}
          </Text>
          {errorMessage(childPage, !singleOption && !deliverySystemIsSelected)}
        </Td>
        <Td>
          <Button
            key={`Edit ${childLink.key}`}
            name={`Edit ${childLink.key}`}
            variant="outline"
            disabled={!singleOption && !deliverySystemIsSelected}
            onClick={() => navigate(buildPath(childLink.template))}
          >
            Edit
          </Button>
        </Td>
      </Tr>
    );
  });
  return (
    <Table variant="measure">
      <Thead>
        <Tr>
          <Th></Th>
          <Th>
            Measure section name <br />
            CMIT Number <br />
            Status
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
