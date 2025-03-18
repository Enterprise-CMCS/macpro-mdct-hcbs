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

export const QualityMeasureTableElement = () => {
  const { report } = useStore();
  const currentPage = useStore(currentPageSelector);

  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  if (!currentPage || currentPage.type !== PageType.Measure) return;
  const measurePage = currentPage as MeasurePageTemplate;
  const deliveryMethodRadio = useLiveElement(
    "delivery-method-radio"
  ) as RadioTemplate;

  const handleEditClick = (deliverySystem: string) => {
    if (report && report.measureLookup) {
      const measure = report?.measureLookup.defaultMeasures.find(
        (measure) => measure.cmit === measurePage.cmit
      );
      const deliveryId = measure?.deliverySystemTemplates.find((item) =>
        item.toString().includes(deliverySystem)
      );
      const path = `/report/${reportType}/${state}/${reportId}/${deliveryId}`;
      navigate(path);
    }
  };
  const singleOption = measurePage.cmitInfo?.deliverySystem.length == 1;

  // Build Rows
  const rows = measurePage.cmitInfo?.deliverySystem.map((system, index) => {
    const selections = deliveryMethodRadio?.answer ?? "";
    const deliverySystemIsSelected = selections.split(",").includes(system);
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">Delivery Method: {system}</Text>
          <Text>CMIT# {measurePage.cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            disabled={!singleOption && !deliverySystemIsSelected}
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
