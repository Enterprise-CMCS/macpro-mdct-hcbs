import { Table, Thead, Th, Tr, Tbody, Td, Text } from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
import { ElementType } from "types";
import { ReactElement } from "react";

export type ReportTableType = {
  indicator: string;
  response?: string | number | ReactElement | undefined;
  helperText?: string;
  type?: ElementType;
};

interface Props {
  rows: ReportTableType[];
}

export const ExportedReportTable = ({ rows }: Props) => {
  return (
    <Table variant="export">
      <Thead>
        <Tr>
          <Th>Indicator</Th>
          <Th>Response</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows?.map((row: ReportTableType) => (
          <Tr>
            <Td>
              <Text>{row.indicator} </Text>
              {row?.helperText && <Text>{row?.helperText}</Text>}
              {row?.type === ElementType.Date && <Text>MM/DD/YYYY</Text>}
            </Td>
            <Td color={row.response ? "palette.base" : "palette.error_darker"}>
              {row.response ?? notAnsweredText}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
