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
import { CMIT_LIST } from "cmit";
import { RadioTemplate, CMIT } from "types";
import { useParams, useNavigate } from "react-router-dom";

export const QualityMeasureTableElement = () => {
  const { cmit, report, pageMap, currentPageId } = useStore();

  if (!currentPageId) return;
  const currentPage = report?.pages[pageMap?.get(currentPageId)!];

  const cmitInfo = CMIT_LIST.find((item) => item.cmit === cmit);
  const deliveryMethodRadio = currentPage?.elements?.find(
    (element) => element.id === "delivery-method-radio"
  ) as RadioTemplate;

  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = (deliverySystem: string, cmitInfo: CMIT) => {
    const path = `/report/${reportType}/${state}/${reportId}/${deliverySystem}${cmitInfo.cmit}`;
    navigate(path);
  };

  // Build Rows
  const rows = cmitInfo?.deliverySystem.map((system, index) => {
    const selections = deliveryMethodRadio.answer ?? "";
    const deliverySystemIsSelected = selections.split(",").includes(system);

    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">Delivery Method: {system}</Text>
          <Text>CMIT# {cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            disabled={!deliverySystemIsSelected}
            onClick={() => handleEditClick(system, cmitInfo)}
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
