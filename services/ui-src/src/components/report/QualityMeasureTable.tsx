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
import { MeasurePageTemplate } from "types";
import { useParams, useNavigate } from "react-router-dom";
import { useWatch } from "react-hook-form";

export const QualityMeasureTableElement = () => {
  const { report, pageMap, currentPageId } = useStore();

  if (!currentPageId) return null;
  const currentPage = report?.pages[
    pageMap?.get(currentPageId)!
  ] as MeasurePageTemplate;

  const cmitInfo = CMIT_LIST.find((item) => item.uid === currentPage?.cmitId);
  const deliveryMethodIndex = currentPage?.elements?.findIndex(
    (element) => element.id === "delivery-method-radio"
  );
  const deliveryMethods = useWatch({
    name: `elements.${deliveryMethodIndex}.answer`,
  }); // the formkey of the radio button
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = (deliverySystem: string) => {
    const path = `/report/${reportType}/${state}/${reportId}/${deliverySystem}${currentPage.id}`;
    navigate(path);
  };

  // Build Rows
  const rows = cmitInfo?.deliverySystem.map((system, index) => {
    const selections = deliveryMethods ?? "";
    const deliverySystemIsSelected = selections.split(",").includes(system);
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">Delivery Method: {system}</Text>
          <Text>CMIT# {currentPage.cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            disabled={!deliverySystemIsSelected}
            onClick={() => handleEditClick(system)}
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
