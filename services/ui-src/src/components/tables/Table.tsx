import { ReactNode } from "react";
import {
  Table as TableRoot,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import { parseHtml } from "utils";
import { TableContentShape } from "types";
import { notAnsweredText } from "../../constants";

export const Table = ({ content, variant, children }: Props) => {
  return (
    <TableRoot variant={variant} size="sm" sx={sx.root}>
      <TableCaption placement="top" sx={sx.captionBox}>
        <VisuallyHidden>{content.caption}</VisuallyHidden>
      </TableCaption>
      {content.headRow && (
        <Thead>
          {/* Head Row */}
          <Tr>
            {content.headRow.map((headerCell: string, index: number) => (
              <Th key={`${index}-head-cell`} scope="col" sx={sx.tableHeader}>
                {parseHtml(headerCell)}
              </Th>
            ))}
          </Tr>
        </Thead>
      )}
      <Tbody>
        {/* if children prop is passed, render the children */}
        {children}
        {/* if content prop is passed, parse and render rows and cells */}
        {content.bodyRows &&
          content.bodyRows!.map((row: string[], index: number) => (
            <Tr key={`${row[0]}${index}-body-row`}>
              {row.map((cell: string, rowIndex: number) => (
                <Td
                  key={`${cell}${rowIndex}-body-cell`}
                  sx={{
                    tableCell: sx.tableCell,
                    color:
                      cell == notAnsweredText ? "palette.error_darker" : "",
                  }}
                >
                  {parseHtml(cell)}
                </Td>
              ))}
            </Tr>
          ))}
      </Tbody>
      <Tfoot>
        {content.footRow &&
          content.footRow?.map((row: string[], index: number) => {
            return (
              <Tr key={`${row[0]}${index}-foot-row`}>
                {row.map((headerCell: string, rowIndex: number) => {
                  return (
                    <Th
                      key={`${rowIndex}-foot-cell`}
                      scope="col"
                      sx={sx.tableHeader}
                    >
                      {parseHtml(headerCell)}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
      </Tfoot>
    </TableRoot>
  );
};

interface Props {
  content: TableContentShape;
  variant?: string;
  children?: ReactNode;
}

const sx = {
  root: {
    width: "100%",
  },
  captionBox: {
    margin: 0,
    padding: 0,
    height: 0,
  },
  tableHeader: {
    padding: "0.75rem 0.5rem",
    borderColor: "palette.gray_lighter",
    ".mobile &": {
      fontSize: "heading_xs",
    },
  },
  tableCell: {
    padding: "0.75rem 0.5rem",
    borderStyle: "none",
    fontWeight: "body_xs",
    ".mobile &": {
      fontSize: "body_xs",
    },
  },
  notAnswered: {
    color: "palette.error_darker",
  },
};
