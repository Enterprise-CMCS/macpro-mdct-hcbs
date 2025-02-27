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
import { MeasurePageTemplate, RadioTemplate } from "types";
import { useParams, useNavigate } from "react-router-dom";
import { useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

export const QualityMeasureTableElement = () => {
  const { report, pageMap, currentPageId } = useStore();
  const { reportType, state, reportId } = useParams();
  const navigate = useNavigate();

  if (!currentPageId) return null;
  const currentPage = report?.pages[
    pageMap?.get(currentPageId)!
  ] as MeasurePageTemplate;

  const cmitInfo = CMIT_LIST.find((item) => item.uid === currentPage?.cmitId);
  const deliveryMethodIndex = currentPage?.elements?.findIndex(
    (element) => element.id === "delivery-method-radio"
  );
  const stateRadio = currentPage?.elements[
    deliveryMethodIndex
  ] as RadioTemplate;
  const [activeDeliveryMethod, setActiveDeliveryMethod] = useState(
    stateRadio.answer
  );
  const formDeliveryMethods = useWatch({
    name: `elements.${deliveryMethodIndex}.answer`,
  }); // the formkey of the radio button

  useEffect(() => {
    if (!formDeliveryMethods) return;
    setActiveDeliveryMethod(formDeliveryMethods);
  }, [formDeliveryMethods]);
  useEffect(() => {
    setActiveDeliveryMethod(stateRadio.answer);
  }, [stateRadio]);

  const handleEditClick = (deliverySystem: string) => {
    if (report && report.measureLookup) {
      const measure = report?.measureLookup.defaultMeasures.find(
        (measure) => measure.cmit === currentPage.cmit
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
    const selections = activeDeliveryMethod ?? "";
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
