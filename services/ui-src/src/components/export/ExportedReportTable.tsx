import {
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  Text,
  Heading,
  Box,
} from "@chakra-ui/react";
import { notAnsweredText } from "../../constants";
import { ElementType } from "types";
import { ReactElement } from "react";

export type ReportTableType = {
  indicator: string;
  response?: string | number | ReactElement | undefined;
  helperText?: string;
  type?: ElementType;
  required?: boolean;
};

interface Props {
  rows: ReportTableType[];
}

export const ExportedReportTable = ({ rows }: Props) => {
  const setTextColor = (element: ReportTableType) => {
    return element.response === notAnsweredText && element.required
      ? "palette.error_darker"
      : "palette.base";
  };

  return (
    <Table variant="export">
      <Thead>
        <Tr>
          <Th>Indicator</Th>
          <Th>Response</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row: ReportTableType, idx) => (
          <Tr key={`${row.indicator}.${idx}`}>
            <Td>
              <Text>{row.indicator} </Text>
              {row.helperText && <Text>{row.helperText}</Text>}
              {row.type === ElementType.Date && <Text>MM/DD/YYYY</Text>}
            </Td>
            <Td color={setTextColor(row)}>{row.response ?? notAnsweredText}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export const ExportRateTable = (
  tableData: { label: string; rows: ReportTableType[] }[]
) => {
  return tableData.map(
    (data: { label: string; rows: ReportTableType[] }, idx) => (
      <Box key={`${data.label}.${idx}`}>
        <Heading as="h4" fontWeight="bold" className="performance-rate-header">
          {data?.label}
        </Heading>
        <ExportedReportTable rows={data?.rows} />
      </Box>
    )
  );
};
