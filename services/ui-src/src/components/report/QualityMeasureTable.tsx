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
import {
  isMeasureTemplate,
  MeasurePageTemplate,
  QualityMeasureTableTemplate,
} from "../../types/report";
import { PageElementProps } from "./Elements";
import { TableStatusIcon } from "components/tables/TableStatusIcon";

export const QualityMeasureTableElement = (props: PageElementProps) => {
  const table = props.element as QualityMeasureTableTemplate;
  const { report, setCurrentPageId } = useStore();
  const measures = report?.pages.filter((page) =>
    isMeasureTemplate(page)
  ) as MeasurePageTemplate[];

  console.log("hello");
  console.log("measures", report);

  const selectedMeasures = measures.filter(
    (page) => table.measureDisplay == "quality"
  );

  // Build Rows
  const rows = selectedMeasures.map((measure, index) => {
    return (
      <Tr key={index}>
        <Td>
          <TableStatusIcon tableStatus=""></TableStatusIcon>
        </Td>
        <Td width="100%">
          <Text fontWeight="bold">{measure.title}</Text>
          <Text>CMIT# {measure.cmit}</Text>
        </Td>
        <Td>
          <Button
            variant="outline"
            onClick={() => setCurrentPageId(measure.id)}
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
