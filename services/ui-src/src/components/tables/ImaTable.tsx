import {
  Button,
  Image,
  Radio,
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VisuallyHidden,
} from "@chakra-ui/react";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import { ImaTableColumn, ImaTableRow } from "types";

interface ImaTableProps {
  caption: string;
  columns: ImaTableColumn[];
  rows: ImaTableRow[];
  label?: string;
  helperText?: string;
  disabled?: boolean;
  errorMessage?: string;
  onAnswerChange: (rowId: string, answer: "yes" | "no") => void;
  onDeleteRow: (rowId: string) => void;
}

export const ImaTable = ({
  caption,
  columns,
  rows,
  label,
  helperText,
  disabled = false,
  errorMessage = "Not compliant.",
  onAnswerChange,
  onDeleteRow,
}: ImaTableProps) => {
  return (
    <fieldset className="ds-c-fieldset">
      {label && <legend className="ds-c-label">{label}</legend>}
      {helperText && <p className="ds-c-hint">{helperText}</p>}
      <Table variant="status">
        <TableCaption>
          <VisuallyHidden>{caption}</VisuallyHidden>
        </TableCaption>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.id} scope="col">
                {column.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <Text>{row.description}</Text>
                {row.answer === "no" && (
                  <Text role="alert" color="palette.error_darker" fontSize="sm">
                    {errorMessage}
                  </Text>
                )}
              </Td>
              <Td>
                <Radio
                  name={row.id}
                  value="yes"
                  isDisabled={disabled}
                  isChecked={row.answer === "yes"}
                  onChange={() => onAnswerChange(row.id, "yes")}
                >
                  <VisuallyHidden>{`Yes for ${row.description}`}</VisuallyHidden>
                </Radio>
              </Td>
              <Td>
                <Radio
                  name={row.id}
                  value="no"
                  isDisabled={disabled}
                  isChecked={row.answer === "no"}
                  onChange={() => onAnswerChange(row.id, "no")}
                >
                  <VisuallyHidden>{`No for ${row.description}`}</VisuallyHidden>
                </Radio>
              </Td>
              <Td>
                <Button
                  variant="link"
                  isDisabled={disabled}
                  aria-label={`Delete ${row.description}`}
                  onClick={() => onDeleteRow(row.id)}
                >
                  <Image src={cancelIcon} alt="" />
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </fieldset>
  );
};
