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
import { MeasurePageTemplate, PageType, RadioTemplate } from "types";
import { useParams, useNavigate } from "react-router-dom";
import { useLiveElement } from "utils/state/hooks/useLiveElement";
import { currentPageSelector } from "utils/state/selectors";

export const MeasureResultsNavigationTableElement = () => {
  const { reportType, state, reportId } = useParams();
  const currentPage = useStore(currentPageSelector);
  const navigate = useNavigate();

  if (!currentPage || currentPage.type !== PageType.Measure) return null;
  const measurePage = currentPage as MeasurePageTemplate;
  const deliveryMethodRadio = useLiveElement(
    "delivery-method-radio"
  ) as RadioTemplate;

  const handleEditClick = (childPageId: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${childPageId}`;
    navigate(path);
  };

  // Note pages like LTSS-5 have 2 child pages, but 1 delivery system.
  const singleOption = measurePage.cmitInfo?.deliverySystem.length == 1;

  // Build Rows
  const rows = measurePage.children?.map((childPage, index) => {
    const selections = deliveryMethodRadio?.answer ?? "";
    const deliverySystemIsSelected = selections
      .split(",")
      .includes(childPage.key);
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">{childPage.linkText}</Text>
          <Text>CMIT# {measurePage.cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            disabled={!singleOption && !deliverySystemIsSelected}
            onClick={() => handleEditClick(childPage.template)}
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
            Measure Name <br />
            CMIT Number
          </Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};
