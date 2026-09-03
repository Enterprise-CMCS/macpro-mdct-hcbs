import {
  Button,
  Image,
  Input,
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
import addIcon from "assets/icons/add/icon_add_blue.svg";
import cancelIcon from "assets/icons/cancel/icon_cancel_primary.svg";
import { ImaTableColumn, ImaTableRow } from "types";

interface ImaTableProps {
  caption: string;
  columns: ImaTableColumn[];
  rows: ImaTableRow[];
  label?: string;
  helperText?: string;
  addButtonText?: string;
  disabled?: boolean;
  errorMessage?: string;
  onAnswerChange: (rowId: string, answer: "yes" | "no") => void;
  onDescriptionChange: (rowId: string, description: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
}

export const ImaTable = ({
  caption,
  columns,
  rows,
  label,
  helperText,
  addButtonText = "Add Other Incident Type",
  disabled = false,
  errorMessage = "Not compliant.",
  onAnswerChange,
  onDescriptionChange,
  onAddRow,
  onDeleteRow,
}: ImaTableProps) => {
  return (
    <fieldset className="ds-c-fieldset">
      {label && <legend className="ds-c-label">{label}</legend>}
      {helperText && <p className="ds-c-hint">{helperText}</p>}
      <Button
        variant="outline"
        leftIcon={<Image src={addIcon} alt="" />}
        isDisabled={disabled}
        onClick={onAddRow}
      >
        {addButtonText}
      </Button>
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
          {rows.map((row) => {
            const rowName = row.description || "new incident type";
            return (
              <Tr key={row.id}>
                <Td>
                  {row.custom ? (
                    <Input
                      value={row.description}
                      isDisabled={disabled}
                      aria-label="Incident type"
                      onChange={(event) =>
                        onDescriptionChange(row.id, event.target.value)
                      }
                    />
                  ) : (
                    <Text>{row.description}</Text>
                  )}
                  {row.answer === "no" && (
                    <Text
                      role="alert"
                      color="palette.error_darker"
                      fontSize="sm"
                    >
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
                    <VisuallyHidden>{`Yes for ${rowName}`}</VisuallyHidden>
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
                    <VisuallyHidden>{`No for ${rowName}`}</VisuallyHidden>
                  </Radio>
                </Td>
                <Td>
                  {row.custom && (
                    <Button
                      variant="link"
                      isDisabled={disabled}
                      aria-label={`Delete ${rowName}`}
                      onClick={() => onDeleteRow(row.id)}
                    >
                      <Image src={cancelIcon} alt="" />
                    </Button>
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </fieldset>
  );
};
