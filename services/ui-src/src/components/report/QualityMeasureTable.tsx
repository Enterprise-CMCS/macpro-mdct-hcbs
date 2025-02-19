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
import { useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { CMIT } from "types";

export const QualityMeasureTableElement = () => {
  const { cmit, report } = useStore();
  const cmitInfo = CMIT_LIST.find((item) => item.cmit === cmit);
  const deliveryMethods = useWatch({ name: "delivery-method-radio" });

  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  const handleEditClick = (deliverySystem: string, cmitInfo: CMIT) => {
    if (report && report.measureLookup) {
      const measure = report?.measureLookup.defaultMeasures.find(
        (measure) => measure.cmit === cmitInfo.cmit
      );
      const deliveryId = measure?.measureTemplate.find((item) =>
        item.toString().includes(deliverySystem)
      );
      const path = `/report/${reportType}/${state}/${reportId}/${deliveryId}`;
      navigate(path);
    }
  };

  // Build Rows
  const rows = cmitInfo?.deliverySystem.map((system, index) => {
    const selections = deliveryMethods?.answer ?? "";
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
